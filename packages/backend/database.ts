import { mongo } from "./deps.ts";
import type { Session, User } from "./types/mod.ts";

const mongoClient = new mongo.MongoClient();
const database = await mongoClient.connect("mongodb://127.0.0.1:27017/todo");

const users = database.collection<User>("users");
await users.createIndexes({
  indexes: [
    { key: { email: 1 }, name: "email", unique: true },
  ],
});

const sessions = database.collection<Session>("sessions");
await sessions.createIndexes({
  indexes: [
    { key: { sessionId: 1 }, name: "sessionId", unique: true },
    { key: { expires: 1 }, name: "expires", expireAfterSeconds: 0 },
  ],
});

export { sessions, users };

export default database;
