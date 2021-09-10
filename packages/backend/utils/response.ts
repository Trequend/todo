import { oak } from "../deps.ts";

interface SuccessOptions {
  // deno-lint-ignore no-explicit-any
  body?: any;
}

interface ErrorOptions {
  message?: string;
  // deno-lint-ignore no-explicit-any
  body?: any;
}

const response = {
  success<P extends oak.RouteParams, S>(
    context: oak.RouterContext<P, S>,
    { body }: SuccessOptions = {},
  ): void {
    context.response.status = 200;
    context.response.body = {
      status: 200,
      body,
    };
  },

  error<P extends oak.RouteParams, S>(
    context: oak.RouterContext<P, S>,
    status: oak.Status,
    { message, body }: ErrorOptions,
  ): void {
    context.response.status = status;
    context.response.body = {
      status,
      message,
      body,
    };
  },

  internalError<P extends oak.RouteParams, S>(
    context: oak.RouterContext<P, S>,
  ): void {
    this.error(context, 500, {
      message: "Internal Server Error",
    });
  },
};

export default response;
