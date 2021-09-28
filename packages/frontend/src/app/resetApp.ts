import { persistentStore } from './persistentStore';

export default function resetApp() {
  persistentStore.clear();
}
