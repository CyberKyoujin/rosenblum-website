export {};

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          renderButton: (
            element: Element,
            options: { theme: string; size: string }
          ) => void;
          prompt: () => void; 
        }
      }
    };
  }
}