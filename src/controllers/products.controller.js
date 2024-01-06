import { generateProducts } from "../mocks/products.js";
import { productsService, usersService } from "../services/index.js";
import myErrorHandler from "../helpers/myErrorHandler.js";

const paginateProducts = async (req, res, next) => {
  try {
    const products = await productsService.paginateProducts(
      {},
      { page: 1, limit: 5 }
    );
    return res.send({ status: "success", payload: products });
  } catch (error) {
    myErrorHandler(error, next);
    req.logger.error(error);
  }
};
const getProductsBy = async (req, res, next) => {
  try {
    const { pid } = parseInt(req.params.pid);
    const product = await productsService.getProductBy(pid);
    if (product === "Not Found") {
      req.logger.warning("Product not found");
      return res.status(400).json({ message: "Producto no encontrado" });
    } else if (product) {
      return res.status(200).json(product);
    } else {
      req.logger.warning("Product not found");
      return res.status(400).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      req.logger.warning("Incomplete data");
      return res.status(400).json({ message: "Error! product not created" });
    }

    const newProduct = {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    };

    if (req.user.role === "premium") {
      const user = await usersService.getUserBy({ _id: req.user.id });
      if (!user) {
        return res
          .status(404)
          .send({ status: "error", message: "User not found" });
      }
      newProduct.owner = user._id;
    } else {
      newProduct.owner = null;
    }

    const product = await productsService.createProduct(newProduct);

    if (product === "The insert code already exists") {
      req.logger.warning("The insert code already exists");
      return res.status(400).json({ message: "Error! product not created" });
    } else if (product === "Complete all fields") {
      req.logger.warning("Incomplete data");
      return res.status(400).json({ message: "Error! product not created" });
    } else {
      req.logger.info("Product created");
      return res.status(201).json({ message: "Product created", product });
    }
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productsService.updateProduct(id, req.body);
    if (product) {
      req.logger.info("Product updated");
      return res.status(200).json({ message: "Product updated", product });
    } else {
      req.logger.warning("Product not updated");
      return res.status(400).json({ message: "Error! product not updated" });
    }
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productsService.deleteProduct(id);
    if (product === `Can't find product with id : ${id}`) {
      req.logger.warning("Product not found");
      return res
        .status(400)
        .json({ message: "Error! Product not deleted", product });
    } else if (product) {
      req.logger.info("Product deleted");
      return res.status(200).json({ message: "Product deleted", product });
    } else {
      req.logger.warning("Product not deleted");
      return res.status(400).json({ message: "Error! Product not deleted" });
    }
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

const mockingProducts = async (req, res, next) => {
  try {
    const products = [];
    for (let i = 0; i < 100; i++) {
      const mockProduct = generateProducts();
      products.push(mockProduct);
    }
    req.logger.info("Mock Products created");
    return res.send({ status: "success", payload: products });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

export default {
  getProductsBy,
  paginateProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  mockingProducts,
};
