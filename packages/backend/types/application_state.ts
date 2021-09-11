import { mongo } from "../deps.ts";
import type User from "./user.ts";
import type { default as Session, RequestSession } from "./session.ts";

type ApplicationState = {
  readonly users: mongo.Collection<User>;
  readonly sessions: mongo.Collection<Session>;
  session?: RequestSession;
};

export default ApplicationState;
