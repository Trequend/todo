import persistentStorage from './persistentStore';

export default async function resetApp() {
  // Endless promise for app lock
  return new Promise(() => {
    persistentStorage.clear();
    window.location.reload();
  });
}
