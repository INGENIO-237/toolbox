import jwt from "jsonwebtoken";
import config from "../config";
import logger from "./logger";

const {
  ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
} = config;

export function signJwt(payload: object, isRefreshToken = false) {
  return jwt.sign(
    payload,
    isRefreshToken
      ? (REFRESH_TOKEN_PRIVATE_KEY as string)
      : (ACCESS_TOKEN_PRIVATE_KEY as string),
    {
      expiresIn: isRefreshToken ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL,
      algorithm: "RS256",
    }
  );
}

export function verifyJwt(token: string, isRefreshToken = false) {
  try {
    const decoded = jwt.verify(
      token,
      isRefreshToken
        ? (REFRESH_TOKEN_PUBLIC_KEY as string)
        : (ACCESS_TOKEN_PUBLIC_KEY as string)
    );

    return { decoded, valid: true, expired: false };
  } catch (error: any) {
    logger.error(error.toString());
    return { expired: true, valid: false, decoded: null };
  }
}

export function reIssueAccessToken(payload: object) {
  return signJwt(payload);
}
