import BaseRouter from "./BaseRouter.js";
import productsController from "../controllers/products.controller.js";

class ProductRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], productsController.paginateProducts);

    this.get("/:pid", ["PUBLIC"], productsController.getProductsBy);

    this.post("/", ["ADMIN", "PREMIUM"], productsController.createProduct);

    this.put("/:pid", ["ADMIN"], productsController.updateProduct);

    this.delete("/:pid", ["ADMIN"], productsController.deleteProduct);

    this.get(
      "/mockingproducts",
      ["PUBLIC"],
      productsController.mockingProducts
    );
  }
}

const productRouter = new ProductRouter();
export default productRouter.getRouter();
