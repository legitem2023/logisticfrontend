// declare module '@react-google-maps/api';
// declare module 'react-google-maps';

// declare global{
//   interface Window {
//     FB: any;
//     google: {
//       accounts: {
//         oauth2: {
//           initTokenClient: (config: {
//             client_id: string;
//             scope: string;
//             callback: (response: {
//               access_token?: string;
//               error?: string;
//               credential?: string;
//             }) => void;
//           }) => {
//             requestAccessToken: () => void;
//           };
//         };
//       };
//     };
//   }
// }

// declarations.d.ts
/// <reference types="@types/google.maps" />

declare module '@react-google-maps/api';

declare global {
  interface Window {
    FB: any;
    google: typeof google;
  }

  // Extend global `google` to include both accounts and maps
  namespace google {
    namespace accounts {
      namespace oauth2 {
        interface TokenClientConfig {
          client_id: string;
          scope: string;
          callback: (response: {
            access_token?: string;
            error?: string;
            credential?: string;
          }) => void;
        }

        interface TokenClient {
          requestAccessToken: () => void;
        }

        function initTokenClient(config: TokenClientConfig): TokenClient;
      }
    }

    // Let TypeScript know `google.maps` exists
    namespace maps {
      // You can leave this empty or define types if you're accessing specific services manually
      const anyMapStuff: any;
    }
  }
}

export {};
