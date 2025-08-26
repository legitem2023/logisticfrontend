declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register: (tag: string) => Promise<void>;
      getTags: () => Promise<string[]>;
    };
  }
}

export {};
