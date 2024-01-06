import __dirname from "../utils.js";

export default {
  welcome: {
    subject: "¡Bienvenido!",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/logo.png`,
        cid: "logo",
      },
    ],
  },
  restorePwd: {
    subject: "Restablecer contraseña",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/logo.png`,
        cid: "logo",
      },
    ],
  },
  purchase: {
    subject: "Gracias por tu compra",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/logo.png`,
        cid: "logo",
      },
    ],
  },
};
