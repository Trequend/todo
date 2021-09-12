import { bcrypt, oak, validasaur } from "../deps.ts";
import { parseBody, response } from "../utils/mod.ts";
import type { ApplicationState } from "../types/mod.ts";
import { auth } from "../middlewares/mod.ts";

const authApi = new oak.Router<oak.RouteParams, ApplicationState>()
  .post("/auth/login", async (context) => {
    if (!context.state.session) {
      throw new Error("No session");
    }

    const body = await parseBody(context);

    const { validate, isEmail, isString, required, firstMessages } = validasaur;
    const [passes, errors] = await validate(body, {
      email: [required, isEmail],
      password: [required, isString],
    });

    if (!passes) {
      return response.error(context, 400, {
        message: "Failed to login",
        body: firstMessages(errors),
      });
    }

    const user = await context.state.users.findOne({ email: body.email }, {
      projection: {
        email: 1,
        passwordHash: 1,
        firstName: 1,
        lastName: 1,
      },
    });
    if (user && await bcrypt.compare(body.password, user.passwordHash)) {
      // deno-lint-ignore no-explicit-any
      const id = (user._id as any).toString();
      context.state.session.data.userId = id;
      context.state.session.maxAge = 30 * 24 * 60 * 60 * 1000;
      context.response.body = { id };
    } else {
      return response.error(context, 400, {
        message: "Invalid email or password",
      });
    }
  })
  .post("/auth/logout", auth(), (context) => {
    if (!context.state.session) {
      throw new Error("No session");
    }

    context.state.session.delete();
    return response.success(context);
  });

export default authApi;
