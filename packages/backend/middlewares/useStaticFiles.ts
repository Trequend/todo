import { oak } from "../deps.ts";

export default function useStaticFiles<AS>(
  app: oak.Application<AS>,
  root: string,
) {
  app.use(async (context) => {
    try {
      await oak.send(context, context.request.url.pathname, {
        root,
        index: "index.html",
      });
    } catch (error) {
      if (oak.isHttpError(error) && error.status === oak.Status.NotFound) {
        await context.send({
          root,
          path: "index.html",
        });
      } else {
        throw error;
      }
    }
  });
}
