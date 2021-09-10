import { mongo, oak } from "./deps.ts";
import { logger, staticFiles } from "./middlewares/mod.ts";
import { users } from "./database.ts";
import { User } from "./types/mod.ts";
import { createUserApi } from "./api/mod.ts";

type State = {
  users: mongo.Collection<User>;
};

const app = new oak.Application<State>({
  state: {
    users,
  },
});

const userApi = createUserApi<State>();

// Middlewares

app.use(logger);
app.use(userApi.routes(), userApi.allowedMethods());
app.use(staticFiles(`${Deno.cwd()}/build`));

// Start

app.listen(":8000");

console.log("Server started at http://localhost:8000");
