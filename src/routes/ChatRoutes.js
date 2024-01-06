import BaseRouter from "./BaseRouter.js";
import { chatService } from "../services/index.js";

class ChatRouter extends BaseRouter {
  init() {
    this.get("/", ["AUTH"], async (req, res) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const searchFilter = {
        createdAt: { $gte: date.toISOString() },
      };

      const messages = await chatService.getMessages(searchFilter);
      res.sendSuccessWithPayload(messages);
    });
  }
}

const chatRouter = new ChatRouter();

export default chatRouter.getRouter();
