import { Service } from "typedi";
import SessionService from "../services/session.services";
import { Request, Response } from "express";
import {
  CreateSessionInput,
  ForgotPasswordConfirmInput,
  ForgotPasswordInput,
  // ResendOtpInput,
} from "../schemas/session.schemas";
import UserService from "../services/user.services";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class SessionController {
  constructor(
    private service: SessionService,
    private userService: UserService
  ) {}

  async createSession(
    req: Request<{}, {}, CreateSessionInput["body"]>,
    res: Response
  ) {
    const { email, password, otp } = req.body;
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || "";

    const { accessToken, refreshToken, otpGenerated } =
      await this.service.createSession({
        email,
        password,
        otp,
        userAgent,
        ip,
      });

    return res.status(HTTP.CREATED).json({ accessToken, refreshToken, otpGenerated });
  }

  async getCurrentUser(req: Request, res: Response) {
    const user = await this.userService.getUser({ id: res.locals.user });

    if (!user) throw new ApiError("User not found", HTTP.NOT_FOUND);

    return res.status(HTTP.OK).json(user);
  }

  async forgotPassword(
    req: Request<{}, {}, ForgotPasswordInput["body"]>,
    res: Response
  ) {
    const { email } = req.body;

    await this.service.forgotPassword({ email });

    return res.status(HTTP.OK).json({
      message:
        "An OTP code has been sent to your email address. Check it please.",
    });
  }

  async forgotPasswordConfirm(
    req: Request<{}, {}, ForgotPasswordConfirmInput["body"]>,
    res: Response
  ) {
    await this.service.forgotPasswordConfirm(req.body);

    return res.sendStatus(HTTP.OK);
  }

  // async resendOtp(req: Request<{}, {}, ResendOtpInput["body"]>, res: Response) {
  //   await this.forgotPassword(req, res);
  // }
}
