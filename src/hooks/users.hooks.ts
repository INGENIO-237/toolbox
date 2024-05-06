import "reflect-metadata";

import EventEmitter from "node:events";
import { USER_HOOK_ACTIONS } from "../utils/constants/hooks.actions";
import sendMail from "../utils/mails/mails.sender";
import MAIL_ACTIONS from "../utils/constants/mail.actions";
import Container from "typedi";
import UserService from "../services/user.services";

const UsersHooks = new EventEmitter();

UsersHooks.on(
  USER_HOOK_ACTIONS.OTP_CODE,
  ({ receiver, otp }: { receiver: string; otp: string | number }) => {
    sendMail(MAIL_ACTIONS.OTP_CODE, { receiver, otp });
  }
);

UsersHooks.on(USER_HOOK_ACTIONS.SOFT_DELETE_ACCOUNT, async (userId: string) => {
  const userService = Container.get(UserService);

  await userService.updateUser(userId, {
    email: "deleted-account-" + userId,
    hasBeenDeleted: true,
  });
});

export default UsersHooks;
