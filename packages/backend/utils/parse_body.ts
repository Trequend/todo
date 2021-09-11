import { oak } from "../deps.ts";

export default async function parseBody(context: oak.Context) {
  try {
    const body = context.request.body({ type: "json" });
    return await body.value;
  } catch {
    context.throw(400);
  }
}
