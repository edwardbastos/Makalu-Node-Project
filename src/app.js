import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

import productsRouter from "./routes/ProductsRouter.js";
import cartsRouter from "./routes/CartRouter.js";
import viewsRouter from "./routes/ViewsRouter.js";
import SessionsRouter from "./routes/SessionsRouter.js";
import chatRouter from "./routes/ChatRoutes.js";
import usersRouter from "./routes/UsersRouter.js";

import __dirname from "./utils.js";
import config from "./config/config.js";
import initializePassportStrategies from "./config/passport.config.js";
import registerChatHandler from "./listeners/chat.listener.js";

const app = express();

const PORT = process.env.PORT || 8081;

const connection = mongoose.connect(config.mongo.URL);
console.log("Base de datos conectada");

const swaggerSpecOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Distribuidora Bescos",
      description: "Aplicación de Distribuidora Bescos, e-commerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yml`],
};

const swaggerSpec = swaggerJSDoc(swaggerSpecOptions);
app.use(
  "/api-docs",
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(swaggerSpec)
);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassportStrategies();

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/users", usersRouter);

app.use("/loggerTest", async (req, res) => {
  req.logger.log("fatal", "Logger test fatal");
  req.logger.log("error", "Logger test error");
  req.logger.log("warning", "Logger test warning");
  req.logger.log("info", "Logger test info");
  req.logger.log("http", "Logger test http");
  req.logger.log("debug", "Logger test");
  res.send({ status: 200, message: "Logger test" });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ error: error.message });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);
  registerChatHandler(io, socket);

  socket.on("disconnect", () => {
    console.log(`Usuario con ID : ${socket.id} esta desconectado `);
  });
});
