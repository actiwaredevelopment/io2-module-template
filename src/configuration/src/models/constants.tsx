import { CSSProperties } from 'react';
import { IStyle } from '@fluentui/react';

export const IS_DEBUG: boolean = process?.env.NODE_ENV === 'development';

export const ENCRYPTION_KEY = 'V6e+z1Wp601Q9lLcmOQoPtwiQQ8bE49lxe2LpH9rEBY=';

export const PIVOT_BASE_STYLES: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
};

export const PIVOT_STRUCTURE_NODE_STYLES: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '450px',
    width: '100%'
};

export const PIVOT_ROOT_STYLES: IStyle = {
    height: 44
};

export const TOGGLE_STYLES: IStyle = {
    marginBottom: 0
};

export const PIVOT_ITEM_CONTAINER_STYLES: IStyle = {
    marginTop: '1rem',
    height: 'calc(100% - 44px)',
    maxHeight: 'calc(100% - 44px)',
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'auto',
    '> div': {
        height: '100%',
        maxHeight: 'calc(100% - 44px)',
        padding: '0 1rem 0 .5rem'
    }
};

export const ACTIONS_STYLE: IStyle = {
    boxSizing: 'border-box',
    paddingRight: '1.5rem' // due to scrollbar repositioning
};

export const INNER_STYLE: IStyle = {
    padding: '0 0 1.5rem 1.5rem' // overwrite to move the scrollbar to the edge
};

export const INNER_CONTENT_STYLE: IStyle = {
    height: '34.75rem'
};

export const SCROLLABLE_CONTENT_STYLE: IStyle = {
    maxWidth: '57.25rem',
    minWidth: '57.25rem'
};
