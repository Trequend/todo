import { oak } from "../deps.ts";

export default function useLogger<AS>(app: oak.Application<AS>) {
  app.use(async (context, next) => {
    console.log(
      `${context.request.method.toUpperCase()} ${context.request.url.href}`,
    );
    try {
      await next();
    } catch (error) {
      console.error(error);
      context.throw(500);
    }
  });
}
