import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      default: "admin",
    },
  },
  { timestamps: true }
);
schema.plugin(mongoosePaginate);

schema.plugin(mongoosePaginate);
const productModel = mongoose.model(collection, schema);

export default productModel;
