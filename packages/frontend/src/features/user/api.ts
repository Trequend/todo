import { persistentStore, STORE_KEYS } from 'src/app/persistentStore';
import { resetApp } from 'src/app/resetApp';
import { User } from 'src/types';
import { createApiFunction } from 'src/utils';

export const fetchUser = createApiFunction(async (fetchApi) => {
  const user: User = await fetchApi('/user');
  return user;
});

export type SignInParams = {
  email: string;
  password: string;
};

export const signIn = createApiFunction(
  async (fetchApi, params: SignInParams) => {
    await fetchApi('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    persistentStore.setItem(STORE_KEYS.AUTHORIZED, 'true');
  }
);

export type SignUpParams = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export const signUp = createApiFunction(
  async (fetchApi, params: SignUpParams) => {
    await fetchApi('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  }
);

export const logout = createApiFunction(async (fetchApi) => {
  await fetchApi('/auth/logout', { method: 'POST' });
  resetApp();
});

export type ChangeAvatarParams = {
  file: File;
};

export const changeAvatar = createApiFunction(
  async (fetchApi, params: ChangeAvatarParams): Promise<string | null> => {
    const data = new FormData();

    data.append('avatar', params.file);

    const { avatarId } = await fetchApi('/user/avatar', {
      method: 'PUT',
      body: data,
    });

    return avatarId;
  }
);

export const deleteAvatar = createApiFunction(async (fetchApi) => {
  await fetchApi('/user/avatar', {
    method: 'DELETE',
  });
});

export type ChangeUserParams = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export const changeUser = createApiFunction(
  async (fetchApi, params: ChangeUserParams) => {
    return (await fetchApi('/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })) as User;
  }
);

export type ChangePasswordParams = {
  password: string;
  newPassword: string;
};

export const changePassword = createApiFunction(
  async (fetchApi, params: ChangeUserParams) => {
    await fetchApi('/user/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  }
);
