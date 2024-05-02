import config from "../../config";
import MAIL_ACTIONS from "../constants/mail.actions";
import logger from "../logger";
import MailTransporter from "./mails.config";
import MAIL_TEMPLATES from "./mails.templates";

interface MailData {
  receiver: string;
  otp?: number | string;
}

export default function sendMail(action: string, data: MailData) {
  const { receiver } = data;

  const template = getCorrespondingMailTemplate(action, data);

  MailTransporter.sendMail(
    {
      from: config.MAIL_SENDER + " " + config.MAIL_USER,
      to: receiver,
      html: template,
      subject: MAIL_ACTIONS.OTP_CODE,
    },
    (error, info) => {
      if (error) {
        logger.error("================MAIL-ERROR================");
        logger.error(error);
        logger.error("================MAIL-ERROR================");
      }
    }
  );
}

function getCorrespondingMailTemplate(action: string, mailData: MailData) {
  switch (action) {
    case MAIL_ACTIONS.OTP_CODE:
      return MAIL_TEMPLATES.OTP(mailData.otp as string);
    default:
      break;
  }
}
