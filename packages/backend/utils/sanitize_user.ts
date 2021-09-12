import type { User } from "../types/mod.ts";

export default function sanitizeUser(user: User) {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
