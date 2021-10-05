import { persistentStore, STORE_KEYS } from '../../app/persistentStore';
import { resetApp } from '../../app/resetApp';
import type { User } from '../../types/User';
import { fetchApi } from '../../utils/fetchApi';

export async function fetchUser() {
  const user: User = await fetchApi('/user');
  return user;
}

export type SignInParams = {
  email: string;
  password: string;
};

export async function signIn(params: SignInParams) {
  await fetchApi('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  persistentStore.setItem(STORE_KEYS.AUTHORIZED, 'true');
}

export type SignUpParams = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export async function signUp(params: SignUpParams) {
  await fetchApi('/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function logout() {
  await fetchApi('/auth/logout', { method: 'POST' });
  resetApp();
}

export type ChangeAvatarParams = {
  file: File;
};

export async function changeAvatar(
  params: ChangeAvatarParams
): Promise<string | null> {
  const data = new FormData();

  data.append('avatar', params.file);

  const { avatarId } = await fetchApi('/user/avatar', {
    method: 'PUT',
    body: data,
  });

  return avatarId;
}

export async function deleteAvatar() {
  await fetchApi('/user/avatar', {
    method: 'DELETE',
  });
}

export type ChangeUserParams = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export async function changeUser(params: ChangeUserParams) {
  return (await fetchApi('/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })) as User;
}

export type ChangePasswordParams = {
  password: string;
  newPassword: string;
};

export async function changePassword(params: ChangeUserParams) {
  await fetchApi('/user/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
