import { oak } from "../deps.ts";
import type { ApplicationState } from "../types/mod.ts";
import { response } from "../utils/mod.ts";

export default function csrfGuard(): oak.Middleware<ApplicationState> {
  return async (context, next) => {
    if (!context.state.session) {
      throw new Error("No session");
    }

    if (context.state.session.withCSRFToken) {
      await next();
    } else {
      return response.error(context, 400, {
        message: "CSRF token required",
      });
    }
  };
}
