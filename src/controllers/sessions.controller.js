import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDto from "../dto/userDto.js";
import MailerService from "../services/MailerService.js";
import DMailTemplates from "../constants//DMailTemplates.js";
import { usersService } from "../services/index.js";
import authService from "../services/authService.js";
import myErrorHandler from "../helpers/myErrorHandler.js";
import { updateLastConnection } from "../helpers/lastConnection.js";

const register = async (req, res, next) => {
  try {
    try {
      const mailerService = new MailerService();
      const result = await mailerService.sendMail(
        [req.user.email],
        DMailTemplates.WELCOME,
        {
          user: req.user,
        }
      );
    } catch (error) {
      req.logger.error(
        `Falló el envío de correo para ${req.user.email}`,
        error
      );
    }
    res.clearCookie("cart");
    req.logger.info("Registered", req.user);
    return res.sendSuccess("Registered");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const login = async (req, res, next) => {
  try {
    const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    res.cookie(config.jwt.COOKIE, token);
    res.clearCookie("cart");
    updateLastConnection(req.user._id);
    req.logger.info("Logged In", req.user);
    return res.sendSuccess("Logged In");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie(config.jwt.COOKIE);
    req.logger.info("Logged Out", req.user);
    updateLastConnection(req.user._id);
    return res.sendSuccess("Logged Out");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const current = async (req, res, next) => {
  try {
    console.log(req.user);
    return res.sendSuccessWithPayload(req.user);
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const githubcallback = async (req, res, next) => {
  try {
    const { firstName, lastName, _id, role, cart, email } = req.user;
    const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });

    res.cookie(config.jwt.COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 86400000,
    });

    res.clearCookie("cart");
    try {
      const mailerService = new MailerService();
      const result = await mailerService.sendMail(
        [req.user.email],
        DMailTemplates.WELCOME,
        {
          user: req.user,
        }
      );

      req.logger.info("User Registered or logged in by Github", req.user);
    } catch (error) {
      req.logger.error(
        `Falló el envío de correo para ${req.user.email}`,
        error
      );
    }
    updateLastConnection(req.user._id);
    req.logger.info("Logged In", req.user);
    return res.redirect("/profile");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const googlecallback = async (req, res, next) => {
  try {
    const { firstName, lastName, _id, role, cart, email } = req.user;
    const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    res.cookie(config.jwt.COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 86400000,
    });
    res.clearCookie("cart");
    try {
      const mailerService = new MailerService();
      const result = await mailerService.sendMail(
        [req.user.email],
        DMailTemplates.WELCOME,
        {
          user: req.user,
        }
      );
      req.logger.info("User Registered or logged in by Google", req.user);
    } catch (error) {
      req.logger.error(
        `Falló el envío de correo para ${req.user.email}`,
        error
      );
    }
    updateLastConnection(req.user._id);
    req.logger.info("Logged In", req.user);
    return res.redirect("/profile");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const passwordRestoreRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersService.getUserBy({ email });
    if (!user) return res.sendBadRequest("User doesn't exist ");
    const token = jwt.sign({ email }, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    const mailerService = new MailerService();
    const result = await mailerService.sendMail(
      [email],
      DMailTemplates.RESTORE_PWD,
      { token }
    );
    req.logger.info("Password Restore Request, sent to", { email, token });
    res.sendSuccess("Email sent");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const passwordRestore = async (req, res, next) => {
  try {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) return res.sendBadRequest("Incomplete values");
    try {
      //El token es válido?
      const { email } = jwt.verify(token, config.jwt.SECRET);
      //El usuario sí está en la base?
      const user = await usersService.getUserBy({ email });
      if (!user) {
        req.logger.error("User doesn't exist with credentials:", {
          email,
          token,
        });
        return res.sendBadRequest("User doesn't exist");
      }
      //¿No será la misma contraseña que ya tiene?
      const isSamePassword = await authService.validatePassword(
        newPassword,
        user.password
      );
      if (isSamePassword) {
        req.logger.error("New Password Cannot be equal to Old Password", {
          email,
          token,
        });
        return res.sendBadRequest(
          "New Password Cannot be equal to Old Password"
        );
      }

      const hashNewPassword = await authService.createHash(newPassword);
      await usersService.updateUser(user._id, { password: hashNewPassword });
      req.logger.info("Password Restore Successful", { email, token });
      res.sendSuccess();
    } catch (error) {
      req.logger.error(error);
      res.sendBadRequest("Invalid token");
    }
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

export default {
  register,
  login,
  logout,
  current,
  githubcallback,
  googlecallback,
  passwordRestoreRequest,
  passwordRestore,
};
