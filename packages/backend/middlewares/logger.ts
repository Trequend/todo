import { colors, oak } from "../deps.ts";

export default function logger(): oak.Middleware {
  return async (context, next) => {
    console.log(
      `${
        colors.green(context.request.method.toUpperCase())
      } ${context.request.url.href}`,
    );
    try {
      await next();
    } finally {
      const color = oak.isErrorStatus(context.response.status)
        ? colors.red
        : colors.green;
      console.log(
        `${context.request.url.href} ${
          color(context.response.status.toString())
        }`,
      );
    }
  };
}
