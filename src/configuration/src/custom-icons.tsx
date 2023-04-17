import { registerIcons } from '@fluentui/react';
import {
    faArrowDown,
    faArrowUp,
    faCircleExclamation,
    faCircleQuestion,
    faClone,
    faCopy,
    faEllipsisVertical,
    faListAlt,
    faPaste,
    faPen,
    faPlay,
    faPlus,
    faSave,
    faSync,
    faTrash
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function initializeCustomIcons() {
    registerIcons({
        icons: {
            'fa-arrow-down': <FontAwesomeIcon icon={faArrowDown} />,
            'fa-arrow-up': <FontAwesomeIcon icon={faArrowUp} />,
            'fa-circle-exclamation': <FontAwesomeIcon icon={faCircleExclamation} />,
            'fa-circle-question': <FontAwesomeIcon icon={faCircleQuestion} />,
            'fa-clone': <FontAwesomeIcon icon={faClone} />,
            'fa-copy': <FontAwesomeIcon icon={faCopy} />,
            'fa-list-alt': <FontAwesomeIcon icon={faListAlt} />,
            'fa-paste': <FontAwesomeIcon icon={faPaste} />,
            'fa-pen': <FontAwesomeIcon icon={faPen} />,
            'fa-play': <FontAwesomeIcon icon={faPlay} />,
            'fa-plus': <FontAwesomeIcon icon={faPlus} />,
            'fa-save': <FontAwesomeIcon icon={faSave} />,
            'fa-sync': <FontAwesomeIcon icon={faSync} />,
            'fa-trash': <FontAwesomeIcon icon={faTrash} />,
            farellipsisvertical: <FontAwesomeIcon icon={faEllipsisVertical} />
        }
    });
}
