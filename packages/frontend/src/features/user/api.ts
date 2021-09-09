import ApiError from '../../errors/ApiError';
import User from '../../types/User';

type Record = {
  user: User;
  password: string;
};

const storage: Array<Record> = [];

export type SignInParams = {
  email: string;
  password: string;
};

export async function signIn({ email, password }: SignInParams): Promise<User> {
  const record = storage.find(({ user }) => user.email === email);
  if (!record) {
    throw new ApiError('Invalid email or password');
  }

  if (record.password !== password) {
    throw new ApiError('Invalid email or password');
  }

  return record.user;
}

export type SignUpParams = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export async function signUp({
  email,
  firstName,
  lastName,
  password,
}: SignUpParams) {
  if (storage.find(({ user }) => user.email === email)) {
    throw new ApiError(`User with email "${email}" already exists`);
  }

  storage.push({
    user: {
      email,
      firstName,
      lastName,
    },
    password,
  });
}

export async function logout() {}
