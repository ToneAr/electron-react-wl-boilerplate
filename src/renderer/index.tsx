import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

// CTRL+Scroll zoom event listener
window.addEventListener(
	'wheel',
	(event: { deltaY: number; ctrlKey: boolean }) => {
		const eventData = {
			ctrlKey: event.ctrlKey,
			deltaY: event.deltaY,
		};
		window.electron.changeZoom(eventData);
	},
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
	// eslint-disable-next-line no-console
	console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

// start WL Socket
window.electron.ipcRenderer.sendMessage('start-wl', []);
// ---------
