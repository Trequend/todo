import { mongo } from "./deps.ts";
import { User } from "./types/mod.ts";

const mongoClient = new mongo.MongoClient();
const database = await mongoClient.connect("mongodb://127.0.0.1:27017/todo");

const users = database.collection<User>("users");
await users.createIndexes({
  indexes: [
    { key: { email: 1 }, name: "email", unique: true },
  ],
});

export { users };

export default database;
