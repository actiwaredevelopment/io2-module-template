import { registerIcons } from '@fluentui/react';

export function initializeCustomIcons() {
    registerIcons({
        icons: {
            'fa-arrow-down': <i className='fa-light fa-arrow-down' />,
            'fa-arrow-up': <i className='fa-light fa-arrow-up' />,
            'fa-circle-exclamation': <i className='fa-light fa-circle-exclamation' />,
            'fa-circle-question': <i className='fa-light a-circle-question' />,
            'fa-clone': <i className='fa-light fa-clone' />,
            'fa-copy': <i className='fa-light fa-copy' />,
            'fa-list-alt': <i className='fa-light fa-list-alt' />,
            'fa-paste': <i className='fa-light fa-paste' />,
            'fa-pen': <i className='fa-light fa-pen' />,
            'fa-play': <i className='fa-light fa-play' />,
            'fa-plus': <i className='fa-light fa-plus' />,
            'fa-save': <i className='fa-light fa-save' />,
            'fa-spinner': <i className='fa-light fa-spinner fa-spin' />,
            'fa-sync': <i className='fa-light fa-sync' />,
            'fa-trash': <i className='fa-light fa-trash' />
        }
    });
}

