import {
    Spinner,
    SpinnerSize,
    Stack
} from '@fluentui/react';
import React from 'react';


export const FullSpinner: React.FunctionComponent = () => {
    return (
        <Stack verticalFill verticalAlign='center'>
            <Spinner size={SpinnerSize.large}></Spinner>
        </Stack>
    );
};
