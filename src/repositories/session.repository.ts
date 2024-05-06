import { Service } from "typedi";
import { UserDocument } from "../models/user.model";
import Session, { SessionDocument } from "../models/session.model";

@Service()
export default class SessionRepository {
  async createSession({
    user,
    userAgent,
    ip,
  }: {
    user: UserDocument["_id"];
    userAgent: string;
    ip: string;
  }) {
    return Session.create({ user, userAgent, ip }).then(
      (createdSession) => createdSession.toObject()
      //  {
      //   const session = await Session.findById(
      //     createdSession._id.toString()
      //   ).select("-userAgent -ip -__v");

      //   return session.toObject();
      // }
    );
  }
}
