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
  await resetApp();
}
