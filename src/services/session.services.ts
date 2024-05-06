import { Service } from "typedi";
import SessionRepository from "../repositories/session.repository";
import {
  CreateSessionInput,
  ForgotPasswordConfirmInput,
} from "../schemas/session.schemas";
import UserService from "./user.services";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";
import { signJwt } from "../utils/jwt.utils";
import OtpService from "./otp.services";
import { UserDocument } from "../models/user.model";
import COMMON_MSG from "../utils/constants/common.msgs";

@Service()
export default class SessionService {
  constructor(
    private repository: SessionRepository,
    private userService: UserService,
    private otpService: OtpService
  ) {}

  async createSession({
    email,
    password,
    otp,
    userAgent,
    ip,
  }: CreateSessionInput["body"] & { userAgent: string; ip: string }) {
    // Ensure if user's registered or not
    const user = (await this.userService.getUser({ email })) as UserDocument;

    if (user.hasBeenDeleted)
      throw new ApiError(
        COMMON_MSG.unregistered("email address"),
        HTTP.NOT_FOUND
      );

    // Validate OTP
    if (otp) {
      if (user.otp !== otp)
        throw new ApiError(COMMON_MSG.invalid("OTP Code"), HTTP.BAD_REQUEST);

      user.isVerified = true;
      user.save();
    } else {
      // Ensure user is verified before pursuing
      const isVerified = await this.ensureUserIsVerified(user);

      if (!isVerified)
        return { otpGenerated: true, accessToken: null, refreshToken: null };
    }

    // Validate user's password/home/ingenio/Desktop/Road/Portfolio/Loumo/loumo-backend/src/hooks
    const passwordIsCorrect = await user.comparePassword(password);

    if (!passwordIsCorrect)
      throw new ApiError("Incorrect password", HTTP.BAD_REQUEST);

    const session = await this.repository.createSession({
      user: user._id,
      userAgent,
      ip,
    });

    // Sign session (Access token & Refresh token)
    const accessToken = signJwt(session);
    const refreshToken = signJwt(session, true);

    return { accessToken, refreshToken, otpGenerated: false };
  }

  async forgotPassword({ email }: { email: string }) {
    // Will throw a 404 error if not found
    const user = (await this.userService.getUser({ email })) as UserDocument;

    if (user.hasBeenDeleted)
      throw new ApiError(
        COMMON_MSG.unregistered("email address"),
        HTTP.NOT_FOUND
      );

    await this.otpService.sendOtp(user);
  }

  async forgotPasswordConfirm({
    email,
    otp,
    password,
  }: ForgotPasswordConfirmInput["body"]) {
    const user = (await this.userService.getUser({ email })) as UserDocument;

    if (user.otp !== otp)
      throw new ApiError(COMMON_MSG.invalid("OTP Code"), HTTP.BAD_REQUEST);

    await this.userService.updateUser(user._id.toString(), { password });
  }

  async ensureUserIsVerified(user: UserDocument) {
    const { isVerified } = user;
    if (isVerified) return isVerified;

    // Send otp code for email verification
    await this.otpService.sendOtp(user);

    return false;
  }
}
