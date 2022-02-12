import { registerIcons } from '@fluentui/react';

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faPlus,
    faTrash,
    faCircleTrash,
    faPen,
    faSave,
    faPlay,
    faCopy,
    faPaste,
    faClone,
    faCircleQuestion,
    faExclamationTriangle,
    faSync,
    faListAlt
} from '@fortawesome/pro-light-svg-icons';

import '@actiwaredevelopment/io-sdk-react/dist/index.css';

import './i18n';
import './index.css';

import i18n from './i18n';
import sdkDE from '@actiwaredevelopment/io-sdk-react/public/locals/language/sdk/de.json';
import sdkEN from '@actiwaredevelopment/io-sdk-react/public/locals/language/sdk/en.json';

registerIcons({
    fontFace: {
        fontFamily: `"Font Awesome 6 Pro"`
    },
    icons: {
        'fa-sync': <FontAwesomeIcon icon={faSync} />,
        'fa-save': <FontAwesomeIcon icon={faSave} />,
        'fa-plus': <FontAwesomeIcon icon={faPlus} />,
        'fa-play': <FontAwesomeIcon icon={faPlay} />,
        'fa-trash': <FontAwesomeIcon icon={faTrash} />,
        'fa-circle-trash': <FontAwesomeIcon icon={faCircleTrash} />,
        'fa-clone': <FontAwesomeIcon icon={faClone} />,
        'fa-pen': <FontAwesomeIcon icon={faPen} />,
        'fa-copy': <FontAwesomeIcon icon={faCopy} />,
        'fa-paste': <FontAwesomeIcon icon={faPaste} />,
        'fa-exclamation-triangle': <FontAwesomeIcon icon={faExclamationTriangle} />,
        'fa-circle-question': <FontAwesomeIcon icon={faCircleQuestion} />,
        'fa-list-alt': <FontAwesomeIcon icon={faListAlt} />
    }
});

// register SDK transaltions
i18n.addResourceBundle('de', 'dynamic', {
    sdkDE
}, true, false);
i18n.addResourceBundle('en', 'dynamic', {
    sdkEN
}, true, false);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
