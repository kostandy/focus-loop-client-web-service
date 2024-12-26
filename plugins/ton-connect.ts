import type { TonConnectUI } from '@tonconnect/ui';

declare module '#app' {
	interface NuxtApp {
		$tonConnectUI: TonConnectUI;
	}
}

// export default defineNuxtPlugin((nuxtApp) => {
//     nuxtApp.hook('app:mounted', () => {
//         console.log('App is mounted');

//         const manifestUrl = `${import.meta.env.DEV ? 'tonsite://focus-loop.ton' : window.location.origin}/tonconnect-manifest.json`;

//         const tonConnectUI = new TonConnectUI({
//             manifestUrl,
//             language: "en",
//             buttonRootId: 'ton-connect-button',
//             uiPreferences: {
//                 borderRadius: 'm',
//                 theme: THEME.DARK,
//                 colorsSet: {
//                     [THEME.DARK]: {
//                         connectButton: {
//                             background: '#3b82f6',
//                             foreground: 'text-white'
//                         }
//                     }
//                 }
//             }
//         });

//         nuxtApp.provide('tonConnectUI', tonConnectUI);
//     });
// })
