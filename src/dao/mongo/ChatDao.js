import chatModel from "./models/chat.model.js";

export default class ChatDao {
  getMessages = (params) => {
    return chatModel.find(params).lean();
  };

  createMessage = async (message) => {
    return chatModel.create(message);
  };
}
