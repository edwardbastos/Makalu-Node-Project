import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.fieldname === "image") {
      return callback(null, `${__dirname}/public/img`);
    } else if (file.fieldname === "profile") {
      return callback(null, `${__dirname}/public/profile`);
    } else if (
      file.fieldname === "frontDni" ||
      file.fieldname === "backDni" ||
      file.fieldname === "addressProof" ||
      file.fieldname === "bankStatement"
    ) {
      return callback(null, `${__dirname}/public/documents`);
    } else if (file.fieldname === "product") {
      return callback(null, `${__dirname}/public/products`);
    } else {
      return callback(null, `${__dirname}/public/others`);
    }
  },
  filename: function (req, file, callback) {
    return callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
