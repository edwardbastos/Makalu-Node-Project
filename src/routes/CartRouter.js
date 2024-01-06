import BaseRouter from "./BaseRouter.js";
import cartsController from "../controllers/carts.controller.js";

class CartRouter extends BaseRouter {
  init() {
    this.get("/:cid", ["USER", "PREMIUM"], cartsController.getCartById);

    this.get(
      "/:cid/purchase",
      ["USER", "PREMIUM"],
      cartsController.purchaseCart
    );

    this.post("/", ["USER", "PREMIUM"], cartsController.createCart);

    this.put(":cid/products/:pid", ["NO_AUTH"], cartsController.addProduct);

    this.put("/products/:pid", ["USER", "PREMIUM"], cartsController.addProduct);

    this.delete(
      "/:cid",
      ["USER", "PREMIUM"],
      cartsController.deleteTotalProduct
    );

    this.delete("/:cid", ["ADMIN"], cartsController.deleteCart);
  }
}
const cartsRouter = new CartRouter();

export default cartsRouter.getRouter();
