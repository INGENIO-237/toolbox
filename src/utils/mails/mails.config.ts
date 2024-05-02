import nodemailer from "nodemailer";
import config from "../../config";

const MailTransporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT as number,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PWD,
  },
});

export default MailTransporter
