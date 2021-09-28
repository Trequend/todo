const prefix = '__APP_STORE__';

function isStoreKey(key: string) {
  return key.startsWith(prefix);
}

function getItemName(key: string) {
  return key.substr(prefix.length);
}

export const STORE_KEYS = {
  AUTHORIZED: 'AUTHORIZED',
};

export type ChangeListener = (name: string, value: string | undefined) => void;

const listeners = new Set<ChangeListener>();

function notifyListeners(name: string, value: string | undefined) {
  listeners.forEach((listener) => listener(name, value));
}

export const persistentStore = Object.freeze({
  setItem(name: string, value: string | undefined) {
    if (value) {
      localStorage.setItem(`${prefix}${name}`, value);
    } else {
      localStorage.removeItem(`${prefix}${name}`);
    }

    notifyListeners(name, value);
  },

  getItem(name: string) {
    return localStorage.getItem(`${prefix}${name}`) || undefined;
  },

  deleteItem(name: string) {
    this.setItem(name, undefined);
  },

  addChangeListener(listener: ChangeListener) {
    listeners.add(listener);
  },

  removeChangeListener(listener: ChangeListener) {
    listeners.delete(listener);
  },

  clear() {
    const names: Array<string> = [];
    const length = localStorage.length;
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i);
      if (key && isStoreKey(key)) {
        names.push(getItemName(key));
      }
    }

    names.forEach((name) => {
      this.deleteItem(name);
    });
  },
});

window.addEventListener('storage', (event) => {
  if (event.storageArea !== localStorage) {
    return;
  }

  const key = event.key;
  if (key && isStoreKey(key)) {
    const name = getItemName(key);
    const value = event.newValue ?? undefined;
    notifyListeners(name, value);
  }
});
