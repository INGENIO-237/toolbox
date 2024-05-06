import { Service } from "typedi";
import UserService from "../services/user.services";
import { Request, Response } from "express";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";
import HTTP from "../utils/constants/http.responses";
import ApiError from "../utils/errors/errors.base";

@Service()
export default class UserController {
  constructor(private service: UserService) {}

  async getUsers(req: Request, res: Response) {
    const users = await this.service.getUsers();

    return res.status(HTTP.OK).json(users);
  }

  async getUser(
    req: Request<{ email?: string; user?: string }>,
    res: Response
  ) {
    const user = await this.service.getUser({
      id: req.params.user,
      email: req.params.email,
    });

    return res.status(HTTP.OK).json(user);
  }

  async createUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    const user = await this.service.createUser(req.body);

    return res.status(HTTP.CREATED).json(user);
  }

  async updateUser(
    req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
    res: Response
  ) {
    const { user } = req.params;
    await this.service.updateUser(user, req.body);

    return res.sendStatus(HTTP.OK);
  }

  async updateUserProfile(
    req: Request<{}, {}, UpdateUserInput["body"]>,
    res: Response
  ) {
    const user = res.locals.user;
    await this.service.updateUser(user, req.body);

    return res.sendStatus(HTTP.OK);
  }

  async deleteUser(req: Request, res: Response) {
    await this.service.deleteUser(res.locals.user);

    return res.sendStatus(HTTP.OK);
  }
}
