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
};

export default response;
