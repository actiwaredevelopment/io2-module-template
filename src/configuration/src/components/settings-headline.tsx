import React from 'react';

import {
    Text,
    Stack,
    IconButton,
    TooltipHost
} from '@fluentui/react';

interface IHeadlineSettingsProps {
    headline: string;

    showHelp?: boolean;
    helpAddress?: string;

    tooltipContent?: string;
}

export const HeadlineSettings: React.FunctionComponent<IHeadlineSettingsProps> = (props) => {
    return (
        <Stack
            horizontal
            verticalAlign='center'
            tokens={{
                childrenGap: '0.875rem'
            }}>

            <Text
                variant={'mediumPlus'}
                style={{
                    paddingBottom: '0.375rem'
                }}>{props.headline}</Text>

            {props.showHelp === true && props.helpAddress !== undefined && (
                <TooltipHost content={props.tooltipContent}>
                    <IconButton
                        iconProps={{
                            iconName: 'fa-circle-question'
                        }}
                        onClick={() => {
                            window.open(props.helpAddress, 'help');
                        }}
                    />
                </TooltipHost>
            )}
        </Stack>
    );
};
