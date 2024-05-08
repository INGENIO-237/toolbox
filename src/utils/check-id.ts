import { Types } from "mongoose";
import ApiError from "./errors/errors.base";
import COMMON_MSG from "./constants/common.msgs";
import HTTP from "./constants/http.responses";

export default function isValidID(id: string) {
  try {
    new Types.ObjectId(id);
  } catch (error) {
    throw new ApiError(
      COMMON_MSG.invalid("Partner identifier"),
      HTTP.BAD_REQUEST
    );
  }
}
