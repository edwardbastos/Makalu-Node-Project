import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "premium"],
      default: "user",
    },
    cart: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "carts",
    },
    active: {
      type: Boolean,
      default: true,
    },
    documents: {
      type: Array,
      default: [{ name: "", reference: "" }],
    },
    last_connection: {
      type: Date,
      default: new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model(collection, schema);

export default userModel;
