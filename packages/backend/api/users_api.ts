import { bcrypt, mongo, oak, validasaur } from "../deps.ts";
import type { ApplicationState } from "../types/mod.ts";
import { parseBody, response } from "../utils/mod.ts";
import { auth } from "../middlewares/mod.ts";

const usersApi = new oak.Router<oak.RouteParams, ApplicationState>()
  .get("/user/sse", auth(), async (context) => {
    if (!context.state.session) {
      throw new Error("No session");
    }

    const id = context.state.session.data.userId;
    if (!id) {
      return response.error(context, 404);
    }

    const user = await context.state.users.findOne({
      _id: new mongo.Bson.ObjectID(id),
    }, {
      projection: {
        _id: 0,
        email: 1,
        firstName: 1,
        lastName: 1,
      },
    });
    if (!user) {
      return response.error(context, 404, {
        message: "User not found",
      });
    }

    const target = response.startSSE(context);
    target.dispatchEvent(new oak.ServerSentEvent("init", user));
  })
  .put("/user", async (context) => {
    const user = await parseBody(context);

    const {
      validate,
      required,
      isEmail,
      isString,
      minLength,
      firstMessages,
    } = validasaur;
    const [passes, errors] = await validate(user, {
      email: [required, isEmail],
      firstName: [required, isString],
      lastName: [required, isString],
      password: [required, isString, minLength(6)],
    });

    if (!passes) {
      return response.error(context, 400, {
        message: "Failed to register user",
        body: firstMessages(errors),
      });
    }

    const foundUser = await context.state.users.findOne(
      { email: user.email },
      { projection: { _id: 1 } },
    );
    if (foundUser) {
      return response.error(context, 400, {
        message: `User with email "${user.email}" already exists`,
      });
    }

    const hash = await bcrypt.hash(user.password);

    context.state.users.insertOne({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: hash,
      todos: [],
    });

    return response.success(context);
  });

export default usersApi;
