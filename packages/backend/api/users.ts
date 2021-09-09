import { bcrypt, mongo, oak, validasaur } from "../deps.ts";
import { User } from "../types/mod.ts";
import { response } from "../utils/mod.ts";

interface WithUsers {
  users: mongo.Collection<User>;
}

function sanitizeUser(user: User) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export default function createUserApi<T extends WithUsers>() {
  return new oak.Router<oak.RouteParams, T>()
    .get("/api/users", async (context) => {
      const filters = context.request.url.searchParams;
      const email = filters.get("email");
      const firstName = filters.get("firstName");
      const lastName = filters.get("lastName");

      const users = await context.state.users.find({
        email: email ?? undefined,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      }).limit(5).map(sanitizeUser);

      context.response.body = users;
    })
    .get("/api/user/:id", async (context) => {
      const id = context.params.id;
      if (!id) {
        return response.error(context, 400, "No id");
      }

      const user = await context.state.users.findOne({
        _id: new mongo.Bson.ObjectID(id),
      });
      if (!user) {
        return response.error(context, 404, "User not found");
      }

      context.response.body = sanitizeUser(user);
    })
    .put("/api/user", async (context) => {
      if (!context.request.hasBody) {
        return response.error(context, 400, "No body");
      }

      if (context.request.body().type !== "json") {
        return response.error(context, 400, "Wrong body type");
      }

      const user = await context.request.body().value;

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
        return response.error(
          context,
          400,
          "Failed to register user",
          firstMessages(errors),
        );
      }

      if (await context.state.users.findOne({ email: user.email })) {
        return response.error(
          context,
          400,
          `User with email "${user.email}" already exists`,
        );
      }

      try {
        const hash = await bcrypt.hash(user.password);

        context.state.users.insertOne({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          passwordHash: hash,
          todos: [],
        });

        return response.success(context);
      } catch (error) {
        console.error(error);
        return response.internalError(context);
      }
    });
}
