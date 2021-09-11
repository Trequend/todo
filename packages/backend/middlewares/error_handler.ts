import { colors, oak } from "../deps.ts";
import { response } from "../utils/mod.ts";

export default function errorHandler(): oak.Middleware {
  return async (context, next) => {
    try {
      await next();
    } catch (error) {
      if (oak.isHttpError(error) && error.status !== 500) {
        response.error(context, error.status);
      } else {
        console.error();
        console.error(colors.red("Error occurred"));
        console.error(context.request);
        console.error(context.response);
        console.error(error);
        console.error();

        response.internalError(context);
      }
    }
  };
}
