import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import UserController from "../controllers/user.controller";
import validate from "../middlewares/validate.request";
import {
  createUserSchema,
  updateUserProfileSchema,
} from "../schemas/user.schemas";
import { tryCatch } from "../utils/errors/errors.utils";
import isAuthenticated from "../middlewares/isAuthenticated";

const UsersRouter = Router();

const controller = Container.get(UserController);

/**
 * @openapi
 *
 * /users:
 *    get:
 *      tags:
 *      - Users
 *      summary: Get list of users
 *      security:
 *        - BearerAuth: []
 *        - RefreshTokenAuth: []
 *
 *      responses:
 *        200:
 *          description: "List of users"
 *          content:
 *            application/json:
 *              schema:
 *        401:
 *          description: Unauthorized to access this resource
 *        500:
 *          description: Internal server error
 */
UsersRouter.get(
  "",
  isAuthenticated,
  tryCatch(controller.getUsers.bind(controller))
);

/**
 * @openapi
 * 
 * /users:
 *  post:
 *    tags:
 *    - Users
 *    summary: Create a user
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUser'
 *    responses:
 *      201:
 *        description: User created
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal server error
 */
UsersRouter.post(
  "",
  validate(createUserSchema),
  tryCatch(controller.createUser.bind(controller))
);

// UsersRouter.put(
//   "/profile",
//   isAuthenticated,
//   validate(updateUserProfileSchema),
//   tryCatch(controller.updateUserProfile.bind(controller))
// );
// UsersRouter.delete(
//   "/delete",
//   isAuthenticated,
//   tryCatch(controller.deleteUser.bind(controller))
// );

export default UsersRouter;
