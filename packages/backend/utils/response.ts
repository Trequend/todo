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
  success(
    context: oak.Context,
    { body }: SuccessOptions = {},
  ): void {
    context.response.status = 200;
    context.response.body = {
      status: 200,
      body,
    };
  },

  error(
    context: oak.Context,
    status: oak.Status,
    { message, body }: ErrorOptions = {},
  ): void {
    context.response.status = status;
    context.response.body = {
      status,
      message,
      body,
    };
  },

  internalError(context: oak.Context): void {
    this.error(context, 500);
  },

  startSSE(context: oak.Context): oak.ServerSentEventTarget {
    const headers = new Headers([["X-Accel-Buffering", "no"]]);
    const target = context.sendEvents({ headers });
    const interval = setInterval(() => {
      target.dispatchComment("ping");
    }, 20000);

    target.addEventListener("close", () => {
      clearInterval(interval);
    });

    return target;
  },
};

export default response;
