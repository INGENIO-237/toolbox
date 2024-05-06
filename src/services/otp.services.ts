import { Service } from "typedi";
import UserService from "./user.services";
import { UserDocument } from "../models/user.model";
import { UsersHooks } from "../hooks";
import { USER_HOOK_ACTIONS } from "../utils/constants/hooks.actions";

@Service()
export default class OtpService {
  constructor(private userService: UserService) {}

  generateOtpCode() {
    return Number(
      Math.floor(Math.random() * 1e5)
        .toString()
        .padStart(5, "0")
    );
  }

  async sendOtp(user: UserDocument) {
    const otp = this.generateOtpCode();

    await this.userService.updateUser(user._id.toString(), { otp });

    UsersHooks.emit(USER_HOOK_ACTIONS.OTP_CODE, { receiver: user.email, otp });
  }
}
