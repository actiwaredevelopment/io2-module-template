import { CONFIG_KEY, IDataQueryExampleConfig, IDataQueryExampleQuery, IDataQueryExampleSource } from './models';
import { IHttpCredential, IItemConfig, IMicrosoft365Credential } from '@actiwaredevelopment/io-sdk-typescript-models';

import { Stack, StackItem, Text, Label } from '@fluentui/react';
import { TFunction } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

export function upgradeConfig(config: IDataQueryExampleConfig): IDataQueryExampleConfig {
    if (config === undefined) {
        config = {};
    }

    const sources: IDataQueryExampleSource[] = [];

    if (config.sources !== undefined && config.sources.length > 0) {
        for (const source of config.sources) {
            if (source !== undefined) {
                const queries: IDataQueryExampleQuery[] = [];

                if (source.id === undefined || source.id === null || source.id.length === 0) {
                    source.id = uuidv4();
                }

                if (source.queries !== undefined && source.queries.length > 0) {
                    for (const query of source.queries) {
                        if (query !== undefined) {
                            if (query.id === undefined || query.id === null || query.id.length === 0) {
                                query.id = uuidv4();
                            }

                            if (query.field_mappings?.length) {
                                query.field_mappings = query.field_mappings.map((mapping) => {
                                    return {
                                        ...mapping,
                                        id: mapping.id ?? uuidv4()
                                    };
                                });
                            }

                            queries.push(query);
                        }
                    }
                }

                sources.push({
                    ...source,
                    queries
                });
            }
        }
    }

    config.sources = sources;

    return config;
}

export function convertToItemConfig(config: IDataQueryExampleConfig): IItemConfig {
    const itemConfig: IItemConfig = {};

    (itemConfig.parameters ??= {})[CONFIG_KEY] = JSON.stringify(config);

    return itemConfig;
}

export function getTooltip(
    item: IDataQueryExampleSource,
    credentials?: IHttpCredential[],
    translate?: TFunction
): JSX.Element {
    let usedCredential: IHttpCredential | IMicrosoft365Credential | undefined;

    // Search credential by given login profile
    if (credentials && credentials.length > 0) {
        for (const search of credentials) {
            const searchCredential: IHttpCredential | IMicrosoft365Credential = search as
                | IHttpCredential
                | IMicrosoft365Credential;

            if (
                searchCredential.id &&
                item.login_profile &&
                searchCredential.id.toLowerCase() === item.login_profile?.toLowerCase()
            ) {
                usedCredential = searchCredential;
                break;
            } else if (
                searchCredential.name &&
                item.login_profile &&
                searchCredential.name.toLowerCase() === item.login_profile?.toLowerCase()
            ) {
                usedCredential = searchCredential;
                break;
            }

            usedCredential = undefined;
        }
    }

    if (usedCredential === undefined) {
        return (
            <Stack
                horizontal
                tokens={{
                    childrenGap: '0.25rem'
                }}>
                <Text>{translate?.('text.LABEL_LOGIN_PROFILE', 'Login Profile')}:</Text>
                <Text>{item.login_profile}</Text>
            </Stack>
        );
    }

    if ((usedCredential as IHttpCredential).base_address !== undefined) {
        return (
            <Stack
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_LOGIN_PROFILE', 'Login Profile')}</Label>
                    <Text>{usedCredential?.name ?? item.login_profile ?? ''}</Text>
                </Stack>

                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_BASE_ADDRESS', 'Base Address')}</Label>
                    <Text>{(usedCredential as IHttpCredential)?.base_address ?? ''}</Text>
                </Stack>
            </Stack>
        );
    } else if ((usedCredential as IMicrosoft365Credential).tenant !== undefined) {
        return (
            <Stack
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_LOGIN_PROFILE', 'Login Profile')}</Label>
                    <Text>{usedCredential?.name ?? item.login_profile ?? ''}</Text>
                </Stack>

                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_TENANT', 'Tenant')}</Label>
                    <Text>{(usedCredential as IMicrosoft365Credential)?.tenant ?? ''}</Text>
                </Stack>

                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_RESOURCE', 'Resource')}</Label>
                    <Text>{(usedCredential as IMicrosoft365Credential)?.resource ?? ''}</Text>
                </Stack>

                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_GRANT_TYPE', 'Grant Type')}</Label>
                    <Text>{(usedCredential as IMicrosoft365Credential)?.grand_type?.toString() ?? ''}</Text>
                </Stack>

                <Stack verticalAlign='center'>
                    <Label>{translate?.('text.LABEL_CLIENT_ID', 'Client ID')}</Label>
                    <Text>{(usedCredential as IMicrosoft365Credential)?.client_id?.toString() ?? ''}</Text>
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack>
            <Stack
                horizontal
                verticalAlign='center'
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <StackItem
                    style={{
                        width: '50%',
                        whiteSpace: 'nowrap'
                    }}>
                    <Label>{translate?.('text.LABEL_LOGIN_PROFILE', 'Login Profile')}</Label>
                </StackItem>
                <StackItem
                    style={{
                        width: '50%',
                        textAlign: 'left'
                    }}>
                    <Text>{usedCredential?.name ?? item.login_profile ?? ''}</Text>
                </StackItem>
            </Stack>
        </Stack>
    );
}

