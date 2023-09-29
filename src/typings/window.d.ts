export {};
declare global {
  const pkgJson: { version: string };

  interface Window {
    store?: unknown;
  }
}
