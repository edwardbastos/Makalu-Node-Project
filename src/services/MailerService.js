import nodemailer from "nodemailer";
import config from "../config/config.js";
import DMailInfo from "../constants/DMailInfo.js";
import Handlebars from "handlebars";
import fs from "fs";
import __dirname from "../utils.js";

export default class MailerService {
  constructor() {
    this.client = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: config.mailer.USER,
        pass: config.mailer.PASS,
      },
    });
  }

  sendMail = async (emails, template, payload) => {
    const mailInfo = DMailInfo[template];
    const html = await this.generateMailTemplate(template, payload);
    const result = await this.client.sendMail({
      from: "Makalu <electrohouse136@gmail.com>",
      to: emails,
      html,
      ...mailInfo,
    });
    return result;
  };

  generateMailTemplate = async (template, payload) => {
    const content = await fs.promises.readFile(
      `${__dirname}/templates/${template}.handlebars`,
      "utf-8"
    );
    const preCompiledContent = Handlebars.compile(content);
    const finalContent = preCompiledContent(payload);
    return finalContent;
  };
}
