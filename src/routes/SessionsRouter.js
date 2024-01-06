import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import sessionsController from "../controllers/sessions.controller.js";

class SessionsRouter extends BaseRouter {
  init() {
    this.post(
      "/register",
      ["PUBLIC"],
      passportCall("register", { strategyType: "LOCALS" }),
      sessionsController.register
    );

    this.post(
      "/login",
      ["NO_AUTH"],
      passportCall("login", { strategyType: "LOCALS" }),
      sessionsController.login
    );

    this.get("/logout", ["AUTH"], sessionsController.logout);

    this.get("/current", ["AUTH"], sessionsController.current);

    this.get(
      "/github",
      ["NO_AUTH"],
      passportCall("github", { strategyType: "GITHUB" }),
      async (req, res) => {}
    );

    this.get(
      "/githubcallback",
      ["NO_AUTH"],
      passportCall("github", {
        scope: ["profile", "email"],
        strategyType: "GITHUB",
      }),
      sessionsController.githubcallback
    );
    this.get(
      "/google",
      ["NO_AUTH"],
      passportCall("google", {
        scope: ["profile", "email"],
        strategyType: "OAUTH",
      }),
      async (req, res) => {}
    );

    this.get(
      "/googlecallback",
      ["NO_AUTH"],
      passportCall("google", {
        scope: ["profile", "email"],
        strategyType: "OAUTH",
      }),
      sessionsController.googlecallback
    );

    this.post(
      "/passwordRestoreRequest",
      ["PUBLIC"],
      sessionsController.passwordRestoreRequest
    );
    this.put(
      "/password-restore",
      ["PUBLIC"],
      sessionsController.passwordRestore
    );
  }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();
