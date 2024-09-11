/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="electron-vite/node" />

import { ElectronHandler } from '../main/preload';

declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {
		electron: ElectronHandler;
	}
}

export {};
