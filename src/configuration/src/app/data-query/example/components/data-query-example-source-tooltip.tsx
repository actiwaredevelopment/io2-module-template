import { IHttpCredential } from '@actiwaredevelopment/io-sdk-typescript-models';
import { Label, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IDataQuerySourceTooltipProps {
    credential: IHttpCredential;
}

export const DataQuerySourceTooltip: React.FunctionComponent<IDataQuerySourceTooltipProps> = (props) => {
    const { t: translate } = useTranslation();

    return (
        <Stack
            styles={{
                root: {
                    width: 'auto'
                }
            }}>
            <Stack
                horizontal
                verticalAlign='center'
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <Label>{translate?.('text.DATA_SOURCE_TOOLTIP_LOGIN_PROFILE', 'Login Profile')}</Label>

                <Stack
                    grow
                    horizontalAlign='start'>
                    <Text>{props.credential.name}</Text>
                </Stack>
            </Stack>

            <Stack
                horizontal
                verticalAlign='center'
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <Label>{translate?.('text.DATA_SOURCE_TOOLTIP_BASE_ADDR', 'Base Address')}</Label>

                <Stack horizontalAlign='start'>
                    <Text>{props.credential.base_address ?? ''}</Text>
                </Stack>
            </Stack>
        </Stack>
    );
};
