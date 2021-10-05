import { User } from '../schemas/user.schema';

export type FilteredUser = Omit<
  User & { avatarId: string | null },
  'passwordHash'
>;
