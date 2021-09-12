import { oak } from "./deps.ts";
import { csrfGuard, errorHandler, logger, session } from "./middlewares/mod.ts";
import { sessions, users } from "./database.ts";
import type { ApplicationState } from "./types/mod.ts";
import { authApi, usersApi } from "./api/mod.ts";

const app = new oak.Application<ApplicationState>({
  state: {
    users,
    sessions,
  },
  contextState: "prototype",
  logErrors: false,
  keys: ["SUPER_TEST"],
});

// Middlewares

app.use(logger());
app.use(errorHandler());
app.use(session({ cookieName: "SESSIONID", initialMaxAge: 360000 }));
app.use(csrfGuard());
app.use(authApi.routes(), authApi.allowedMethods());
app.use(usersApi.routes(), usersApi.allowedMethods());

// Start

app.listen(":8000");

console.log("Server started at http://localhost:8000");
