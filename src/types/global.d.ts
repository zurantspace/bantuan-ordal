// Global type declarations for browser-injected scripts

interface SnapOptions {
  onSuccess?: (result: Record<string, unknown>) => void;
  onPending?: (result: Record<string, unknown>) => void;
  onError?: (result: Record<string, unknown>) => void;
  onClose?: () => void;
  language?: string;
  autoCloseDelay?: number;
}

interface SnapInstance {
  pay: (token: string, options?: SnapOptions) => void;
  hide: () => void;
}

declare global {
  interface Window {
    snap?: SnapInstance;
  }
}

export {};
