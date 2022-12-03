import { FullSpinner } from '@actiwaredevelopment/io-sdk-react';

import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { initializeCustomIcons } from './custom-icons';

import { ThemeProvider } from '@fluentui/react';

import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App';

import '@actiwaredevelopment/io-sdk-react/dist/index.css';

import './i18n';
import './index.css';

import i18n from './i18n';
import sdkDE from '@actiwaredevelopment/io-sdk-react/public/locals/language/sdk/de.json';
import sdkEN from '@actiwaredevelopment/io-sdk-react/public/locals/language/sdk/en.json';

initializeIcons('/fonts/font-icons-mdl2/');
initializeCustomIcons();

// register SDK transaltions
i18n.addResourceBundle(
    'de',
    'dynamic',
    {
        sdkDE
    },
    true,
    false
);
i18n.addResourceBundle(
    'en',
    'dynamic',
    {
        sdkEN
    },
    true,
    false
);

ReactDOM.render(
    <StrictMode>
        <ThemeProvider id='root-theme'>
            <Suspense fallback={<FullSpinner />}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Suspense>
        </ThemeProvider>
    </StrictMode>,
    document.getElementById('root')
);

