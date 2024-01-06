import BaseRouter from "./BaseRouter.js";
import userController from "../controllers/user.controller.js";
import uploader from "../services/uploadService.js";

class UsersRouter extends BaseRouter {
  init() {
    this.get("/", ["ADMIN"], userController.getUsers);
    this.get("/:uid", ["NO_AUTH"], userController.getUserBy);
    this.post("/", ["PUBLIC"], userController.createUser);
    this.put("/:user", ["USER"], userController.updateUser);
    this.post(
      "/:uid/documents",
      ["USER"],
      uploader.fields([
        { name: "profile", maxCount: 1 },
        { name: "frontDni", maxCount: 1 },
        { name: "backDni", maxCount: 1 },
        { name: "addressProof", maxCount: 1 },
        { name: "bankStatement", maxCount: 1 },
      ]),
      userController.uploadDocuments
    );
    this.put("/premium/:uid", ["USER"], userController.upgradeUser);

    this.delete("/:uid", ["ADMIN"], userController.deleteUser);
  }
}
const usersRouter = new UsersRouter();

export default usersRouter.getRouter();
