import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {IConfig} from "./data/Config";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

declare global {
    interface Window {
        initNHelpDesk: (config: IConfig, elementId?: string) => void;
    }
}

window.initNHelpDesk = (config, elementId = 'chat-root') => {
    const rootElement = document.getElementById(elementId);

    if (!rootElement) {
        console.error(`Element #${elementId} not found!`);
        return;
    }

    createRoot(rootElement).render(
        <StrictMode>
            <App {...config} />
        </StrictMode>
    );
};
