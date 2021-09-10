import { oak } from "../deps.ts";

const logger: oak.Middleware = async (context, next) => {
  console.log(
    `${context.request.method.toUpperCase()} ${context.request.url.href}`,
  );
  try {
    await next();
  } catch (error) {
    console.error(error);
    context.throw(500);
  }
};

export default logger;
