import { useEffect, useState } from 'react';
import { ChangeListener, persistentStore } from 'src/app/persistentStore';

export function usePersistentStore(name: string) {
  const [value, setValue] = useState<string | undefined>(() => {
    return persistentStore.getItem(name);
  });

  useEffect(() => {
    const listener: ChangeListener = (key, value) => {
      if (name === key) {
        setValue(value);
      }
    };

    persistentStore.addChangeListener(listener);
    return () => {
      persistentStore.removeChangeListener(listener);
    };
  }, [name]);

  return value;
}
