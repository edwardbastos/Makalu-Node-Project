import { usersService } from "../services/index.js";
import myErrorHandler from "../helpers/myErrorHandler.js";
import UserDto from "../dto/userDto.js";
import uploader from "../services/uploadService.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    const usersInfo = users.map((user) => {
      return {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      };
    });

    req.logger.info("Users retrieved successfully", usersInfo);
    return res.send({ status: "success", payload: usersInfo });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const getUserBy = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserBy({ _id: uid });
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const createUser = async (req, res, next) => {
  try {
    const result = await usersService.createUser();
    req.logger.info("User created successfully", result._id);
    return res.send({ status: "success", payload: result._id });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserBy({ _id: uid });
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    const result = await usersService.updateUser(uid, req.body);
    req.logger.info("User updated successfully", { uid });
    return res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserBy({ _id: uid });
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    await usersService.deleteUser(uid);
    req.logger.info("User deleted successfully", { uid });
    return res.send({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const upgradeUser = async (req, res, next) => {
  try {
    const { uid } = req.user.id;
    const user = await usersService.getUserBy({ _id: uid });

    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }

    if (user.role === "premium") {
      return res
        .status(400)
        .send({ status: "error", message: "User already upgraded" });
    }

    if (user.role === "user" && user.isPremium === true) {
      const updatedUser = await usersService.updateUser(
        { _id: uid },
        { role: "premium" }
      );

      const tokenizedUser = UserDto.getTokenDTOFrom(updatedUser);
      const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
        expiresIn: "1d",
      });

      res.cookie(config.jwt.COOKIE, token);

      req.logger.info("User upgraded", uid);
      return res
        .status(200)
        .send({ status: "success", message: "User upgraded successfully" });
    }
  } catch (error) {
    console.error("Error in upgradeUser:", error);
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const uploadDocuments = async (req, res, next) => {
  try {
    // Acceder a los archivos cargados
    const profile = req.files["profile"][0];
    const frontDni = req.files["frontDni"][0];
    const backDni = req.files["backDni"][0];
    const addressProof = req.files["addressProof"][0];
    const bankStatement = req.files["bankStatement"][0];

    // Crear un array de objetos con la información de los archivos cargados
    const documents = [
      { name: profile.filename, reference: profile.path },
      { name: frontDni.filename, reference: frontDni.path },
      { name: backDni.filename, reference: backDni.path },
      { name: addressProof.filename, reference: addressProof.path },
      { name: bankStatement.filename, reference: bankStatement.path },
    ];
    // Actualizar el usuario con los archivos cargados
    const user = await usersService.updateUser(
      { _id: req.user.id },
      { documents }
    );

    // Enviar la respuesta
    return res.sendSuccess({
      status: "success",
      message: "Documents uploaded successfully",
    });
  } catch (error) {
    uploader(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        req.logger.error(error);
        myErrorHandler(error, next);
      } else {
        req.logger.error(error);
        myErrorHandler(error, next);
      }
    });
  }
};

export default {
  getUsers,
  getUserBy,
  createUser,
  updateUser,
  deleteUser,
  upgradeUser,
  uploadDocuments,
};
