import { persistentStore } from './persistentStore';

export function resetApp() {
  persistentStore.clear();
}
