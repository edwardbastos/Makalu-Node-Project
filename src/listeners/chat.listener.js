import { chatService } from "../services/index.js";

const registerChatHandler = (io, socket) => {
  const saveMessage = async (data) => {
    console.log(data);
    const result = await chatService.createMessage(data);
    io.emit("chat:logMessage", data);
  };
  socket.on("chat:message", saveMessage);
};

export default registerChatHandler;
