import { genSalt, hash } from "bcrypt";
import config from "../config";

export default async function hashPassword(password: string) {
  const salt = await genSalt(config.SALT_FACTOR);
  return await hash(password, salt);
}
