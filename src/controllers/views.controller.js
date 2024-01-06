import {
  productsService,
  cartsService,
  ticketsService,
} from "../services/index.js";

import jwt from "jsonwebtoken";

import config from "../config/config.js";

import { getValidFilters } from "../utils.js";

import myErrorHandler from "../helpers/myErrorHandler.js";

const home = async (req, res, next) => {
  try {
    return res.render("home");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const register = async (req, res, next) => {
  try {
    return res.render("register");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const login = async (req, res, next) => {
  try {
    return res.render("login");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const profile = async (req, res, next) => {
  try {
    return res.render("profile");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const products = async (req, res, next) => {
  try {
    let { page = 1, limit = 5, sort, order = 1, ...filters } = req.query;
    const cleanFilters = getValidFilters(filters, "product");

    let sortResult = {};
    if (sort) {
      sortResult[sort] = order;
    }
    const pagination = await productsService.paginateProducts(cleanFilters, {
      page,
      lean: true,
      limit,
      sort: sortResult,
    });

    return res.render("productos", {
      products: pagination.docs,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      page: pagination.page,
    });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const chat = async (req, res, next) => {
  try {
    return res.render("chat");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const realTimeProducts = async (req, res, next) => {
  try {
    const listaProductos = await productsService.getProducts();
    return res.render("realTimeProducts", { listaProductos });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const cart = async (req, res, next) => {
  try {
    const cart = await cartsService.getCartById(req.user._id);
    return res.render("cart", { cart });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const purchase = async (req, res, next) => {
  try {
    const ticket = await ticketsService.getTicketsBy(req.user.cart._id);

    return res.render("purchase", { ticket });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const restorePassword = async (req, res, next) => {
  try {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) return res.sendBadRequest("Incomplete values");
    try {
      //El token es válido?
      const { email } = jwt.verify(token, config.jwt.SECRET);
      //El usuario sí está en la base?
      const user = await usersService.getUserBy({ email });
      if (!user) return res.sendBadRequest("User doesn't exist");
      //¿No será la misma contraseña que ya tiene?
      const isSamePassword = await authService.validatePassword(
        newPassword,
        user.password
      );
      if (isSamePassword)
        return res.sendBadRequest(
          "New Password Cannot be equal to Old Password"
        );
      //Hashear mi nuevo password
      const hashNewPassword = await authService.createHash(newPassword);
      await usersService.updateUser(user._id, { password: hashNewPassword });
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
const passwordRestore = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token)
      return res.render("RestorePasswordError", {
        error:
          "Ruta inválida, por favor solicita un nuevo link de restablecimiento",
      });
    try {
      jwt.verify(token, config.jwt.SECRET);
      req.logger.info("Link valid to restore password");
      return res.render("passwordRestore", { token });
    } catch (error) {
      req.logger.error(error);
      console.log(Object.keys(error));
      if (error.expiredAt) {
        req.logger.warning("Link expired", error.expiredAt);
        return res.render("RestorePasswordError", {
          error:
            "Link expirado, por favor solicita un nuevo link de restablecimiento",
        });
      }
      req.logger.warning("Trying to restore password with invalid Link");
      return res.render("RestorePasswordError", {
        error:
          "Link inválido o corrupto. Por favor solicita un nuevo link de restablecimiento",
      });
    }
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const premium = async (req, res, next) => {
  try {
    return res.render("premium");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const productCreator = async (req, res, next) => {
  try {
    return res.render("productCreator");
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

export default {
  home,
  register,
  login,
  profile,
  products,
  chat,
  realTimeProducts,
  cart,
  purchase,
  passwordRestore,
  restorePassword,
  premium,
  productCreator,
};
