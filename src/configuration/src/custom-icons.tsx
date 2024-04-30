import { getTheme, registerIcons } from '@fluentui/react';
import {
    faPlus,
    faTrash,
    faPen,
    faSave,
    faPlay,
    faCopy,
    faPaste,
    faClone,
    faCircleQuestion,
    faExclamationTriangle,
    faSync,
    faListAlt,
    faCircleTrash,
    faArrowDown,
    faArrowUp,
    faBookOpenReader,
    faPenLine,
    faSpinner,
    faEllipsisVertical,
    faCircleExclamation,
    faTriangleExclamation,
    faUserPlus
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const theme = getTheme();

export function initializeCustomIcons() {
    registerIcons({
        icons: {
            'fa-spinner': (
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                />
            ),
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
            'fa-circle-exclamation': <FontAwesomeIcon icon={faCircleExclamation} />,
            'fa-list-alt': <FontAwesomeIcon icon={faListAlt} />,
            'fa-database-reader': <FontAwesomeIcon icon={faBookOpenReader} />,
            'fa-database-writer': <FontAwesomeIcon icon={faPenLine} />,
            'fa-arrow-up': <FontAwesomeIcon icon={faArrowUp} />,
            'fa-arrow-down': <FontAwesomeIcon icon={faArrowDown} />,
            FarEllipsisVertical: <FontAwesomeIcon icon={faEllipsisVertical} />,
            'fal-triangle-exclamation-colored': (
                <FontAwesomeIcon
                    color={theme.semanticColors.errorIcon}
                    icon={faTriangleExclamation}
                />
            ),
            'fa-user-plus': <FontAwesomeIcon icon={faUserPlus} />
        }
    });
}
