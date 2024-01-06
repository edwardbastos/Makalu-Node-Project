import mongoose from "mongoose";

const collection = "messages";

const schema = new mongoose.Schema(
  {
    username: String,
    userId: mongoose.SchemaTypes.ObjectId,
    role: String,
    body: String,
  },
  { timestamps: true }
);

const chatModel = mongoose.model(collection, schema);

export default chatModel;
