const prefix = '__APP_STORE__';

const persistentStore = {
  setItem(name: string, value: string | undefined) {
    if (value) {
      localStorage.setItem(`${prefix}${name}`, value);
    } else {
      localStorage.removeItem(`${prefix}${name}`);
    }
  },

  getItem(name: string) {
    return localStorage.getItem(`${prefix}${name}`) || undefined;
  },

  clear() {
    const keys: Array<string> = [];
    const length = localStorage.length;
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};

export default persistentStore;
