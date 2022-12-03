import { CREDENTIAL_STORE_ID, MODULE_ID } from '../../../models/constants';
import { IDataQueryStates, IDataQueryExampleSource, IDataQueryExampleQuery } from '../models';

import {
    ADD_IN_ID,
    CONFIG_KEY,
    DATA_SOURCE_QUERY_DELIMITER,
    IDataQueryExampleConfig
} from '../models/data-query-example-config';
import {
    FieldType,
    IItemConfig,
    IQueryItem,
    IResultTable,
    QueryType
} from '@actiwaredevelopment/io-sdk-typescript-models';
import { ISystemInfoRequest, ISystemInfoResponse, SystemInfo } from '@actiwaredevelopment/io-sdk-typescript-designer';

import { Fragment, useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import { ContextualMenuItemType, ICommandBarItemProps, PanelType, Stack, Text } from '@fluentui/react';
import {
    AddInContentLayout,
    AddInContentWithItemList,
    commandBarUtils,
    sdkHelper
} from '@actiwaredevelopment/io-sdk-react';

import { convertToItemConfig, upgradeConfig, getTooltip } from '../utils';
import { v4 as uuidv4 } from 'uuid';

import { useCredentials } from '../../../hooks';
import { useDataQuerySourceNav } from '../hooks';

import {
    DataQueryExampleSourceDialog,
    IDataQueryExampleSourceDialogConfig
} from '../dialogs/data-query-example-source-dialog';

import { DataQueryExampleQueries } from './data-query-example-queries';

import {
    DataQueryExampleDeleteDialog,
    IDataQueryExampleDeleteDialogConfig
} from '../dialogs/data-query-example-delete-dialog';

import {
    IDataQueryExampleQueryConfigStatePanelConfig,
    DataQueryExampleQueryConfigStatePanel
} from '../dialogs/data-query-example-query-config-panel';

import {
    DataQueryExampleQueryDeleteDialog,
    IDataQueryExampleQueryDeleteDialogConfig
} from '../dialogs/data-query-example-query-delete-dialog';

const SYSTEM_INFO_REQUEST: ISystemInfoRequest = {
    mode: SystemInfo.ContextMenuItems | SystemInfo.Credentials,
    credential_store_filter: [CREDENTIAL_STORE_ID],
    context_menu_items:
        FieldType.Parameter | FieldType.DataField | FieldType.Variable | FieldType.NodeField | FieldType.Plugins
};

const defaultConfig: IDataQueryExampleConfig = {
    sources: []
};

const defaultQueryConfig: IDataQueryExampleQuery = {
    id: uuidv4(),
    name: '',
    query: '',
    field_mappings: []
};

export interface IDataQueryExampleConfigProps {
    config?: IDataQueryExampleConfig;
    systemInfo?: ISystemInfoResponse;

    selectedSource?: IDataQueryExampleSource;
    selectedItemIds?: string[];
    selectionCommands?: ICommandBarItemProps[];

    onOpen?: () => void;
    onChange?: (config: IDataQueryExampleConfig) => void;
    onValidate?: (config?: IDataQueryExampleConfig, callback?: (error?: Record<string, string>) => void) => void;

    onChangeDataQuerySelection?: (ids: string[]) => void;

    onGetQueryCommands?: (
        item?: IDataQueryExampleQuery,
        callback?: (commands?: ICommandBarItemProps[]) => void
    ) => void;
}

export const DataQueryExampleConfig: React.FunctionComponent = () => {
    const { t: translate } = useTranslation();

    const isDebug = location.search.toLowerCase().includes('debug');

    const [sourceDeleteDialogConfig, setSourceDeleteDialogConfig] = useState<IDataQueryExampleDeleteDialogConfig>();
    const [dataQuerySearchSourceDialogConfig, setDataQueryExampleSourceDialogConfig] =
        useState<IDataQueryExampleSourceDialogConfig>();

    const [queryDeleteDialogConfig, setQueryDeleteDialogConfig] = useState<IDataQueryExampleQueryDeleteDialogConfig>();
    const [dataQuerySearchQueryPanelConfig, setDataQueryExampleQueryPanelConfig] =
        useState<IDataQueryExampleQueryConfigStatePanelConfig>();

    const [apiInitialized, setApiInitialized] = useState<boolean>(false);
    const [config, setConfig] = useState<IDataQueryExampleConfig>(defaultConfig);
    const [systemInfo, setSystemInfo] = useState<ISystemInfoResponse | undefined>();

    const credentials = useCredentials(systemInfo ?? {});

    const dataQuerySourceNav = useDataQuerySourceNav(config);
    const [selectedSource, setSelectedSource] = useState<IDataQueryExampleSource | undefined>(undefined);

    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [dataQueryStates, setDataQueryStates] = useState<IDataQueryStates>({});

    const [stillSaving, setStillSaving] = useState<boolean>(false);

    const handleLoad = useCallback(
        (configItem?: IItemConfig, systemInfo?: DesignerAPI.ISystemInfoResponse) => {
            let config: IDataQueryExampleConfig | undefined;
            const configParameter = configItem?.parameters?.[CONFIG_KEY];

            if (configParameter) {
                try {
                    config = JSON.parse(configParameter);
                } catch (error) {
                    console.error(error);
                }
            }

            if (isDebug) {
                console.log({ config, configItem, systemInfo });
            }

            setConfig(upgradeConfig(config ?? {}));
            setSystemInfo(systemInfo);
        },
        [isDebug]
    );

    const handleSave = useCallback(() => {
        if (stillSaving === true) {
            return;
        }

        const itemConfig = convertToItemConfig(config);

        setStillSaving(true);

        if (isDebug) {
            console.log({ config, itemConfig });
            console.log(JSON.stringify(itemConfig));

            setStillSaving(false);
        }

        if (apiInitialized && !isDebug) {
            DesignerAPI.dataQueryAddin.saveConfig(itemConfig, () => {
                setStillSaving(false);
            });
        }
    }, [apiInitialized, config, stillSaving, isDebug]);

    const handleSystemInfoUpdate = useCallback(
        (updateEvent?: DesignerAPI.IUpdateEvent) => {
            const systemInfo = updateEvent?.result as DesignerAPI.ISystemInfoResponse;

            if (isDebug) {
                console.log({ systemInfo });
            }

            if (systemInfo) {
                setSystemInfo(systemInfo);
            }
        },
        [isDebug]
    );

    useEffect(() => {
        if (selectedItemIds.length > 0) {
            console.log(dataQueryStates[selectedItemIds[0]]);
        }
    }, [dataQueryStates, selectedItemIds]);

    // Load Designer API and credential store config
    useEffect(() => {
        if (isDebug || apiInitialized) {
            return;
        }

        DesignerAPI.initialize(() => {
            DesignerAPI.dataQueryAddin.loadConfig(SYSTEM_INFO_REQUEST, handleLoad);

            setApiInitialized(true);
        });
    }, [apiInitialized, handleLoad, isDebug]);

    // Update save handler
    useEffect(() => {
        if (!apiInitialized) {
            return;
        }

        DesignerAPI.dataQueryAddin.registerOnSaveHandler(handleSave);
    }, [apiInitialized, handleSave]);

    // Update system info update handler
    useEffect(() => {
        if (!apiInitialized) {
            return;
        }

        DesignerAPI.system.registerOnUpdateHandler(handleSystemInfoUpdate);
    }, [apiInitialized, handleSystemInfoUpdate]);

    useEffect(() => {
        if (selectedSource === undefined && config?.sources?.length) {
            setSelectedSource(config.sources[0]);
        }
    }, [config, selectedSource]);

    const topNavigation: ICommandBarItemProps[] = [
        {
            key: 'save',
            text: translate('text.BUTTON_SAVE', 'Save'),
            iconProps: {
                iconName: stillSaving ? 'fa-spinner' : 'fa-save'
            },
            onClick: handleSave
        },
        {
            key: 'divider_save',
            itemType: ContextualMenuItemType.Divider,
            onRender: commandBarUtils.renderDivider
        },
        {
            key: 'add-source',
            text: translate('text.BUTTON_ADD_SOURCE', 'Add Source'),
            iconProps: {
                iconName: 'fa-plus'
            },
            onClick: () => {
                handleActions('ADD-SOURCE');
            }
        },
        {
            key: 'edit-source',
            disabled: !selectedSource,
            text: translate('text.BUTTON_EDIT', 'Edit'),
            iconProps: {
                iconName: 'fa-pen'
            },
            onClick: () => {
                handleActions('EDIT-SOURCE');
            }
        },
        {
            key: 'clone-source',
            disabled: !selectedSource,
            text: translate('text.BUTTON_DUPLICATE', 'Duplicate'),
            iconProps: {
                iconName: 'fa-clone'
            },
            onClick: () => {
                handleActions('CLONE-SOURCE');
            }
        },
        {
            key: 'remove-source',
            disabled: !selectedSource,
            text: translate('text.BUTTON_REMOVE', 'Remove'),
            iconProps: {
                iconName: 'fa-trash'
            },
            onClick: () => {
                handleActions('REMOVE-SOURCE');
            }
        },
        {
            key: 'divider_source',
            itemType: ContextualMenuItemType.Divider,
            onRender: commandBarUtils.renderDivider
        },
        {
            key: 'add-query',
            text: translate('text.BUTTON_ADD_QUERY', 'Add Query'),
            disabled: !selectedSource,
            onClick: () => {
                handleActions('ADD-QUERY');
            },
            iconProps: {
                iconName: 'fa-plus'
            }
        }
    ];

    let selectionCommands: ICommandBarItemProps[] = [];

    if (selectedSource) {
        if (selectedItemIds && selectedItemIds?.length === 1) {
            const dataQuery = selectedSource?.queries?.find((element) => {
                return element.id?.toLowerCase() === selectedItemIds?.[0]?.toLowerCase();
            });

            selectionCommands = getSingleSelectionCommands(dataQuery);
        } else if (selectedItemIds && selectedItemIds?.length > 1) {
            const dataQueries = selectedSource?.queries?.filter((element) => {
                return selectedItemIds?.some((search) => search.toLowerCase() === element.id?.toLowerCase());
            });

            selectionCommands = getMultiSelectionCommands(dataQueries ?? []);
        }

        topNavigation.push(...selectionCommands);
    }

    function renderDataSourceTooltip(item: unknown): string | JSX.Element | JSX.Element[] {
        if (!item) {
            return '';
        }

        const source = item as IDataQueryExampleSource;

        if (!source) {
            return '';
        }

        return getTooltip(source, credentials, translate);
    }

    function getSingleSelectionCommands(item?: IDataQueryExampleQuery): ICommandBarItemProps[] {
        if (!item?.id) {
            return [];
        }

        const isTesting = !!dataQueryStates?.[item.id]?.isTesting;
        // const isDialogOpen = !!creationDialogConfig?.show || !!stateCreateDialogConfig?.show;
        const isDialogOpen = false;

        // `isDialogOpen`:
        // The duplicate dialog uses the isLoading flag while retrieving the current version.
        // The spinner would therefore be displayed in the wrong context.
        const editHasSpinner = isTesting && !isDialogOpen;
        const inProgress = editHasSpinner;

        const itemCommands: ICommandBarItemProps[] = [];

        itemCommands.push(
            {
                key: 'edit-query',
                text: translate('text.BUTTON_EDIT', 'Edit'),
                onClick: () => {
                    handleActions('EDIT-QUERY');
                },
                iconProps: {
                    iconName: editHasSpinner ? 'fa-spinner' : 'fa-pen'
                }
            },
            {
                key: 'duplicate',
                text: translate('text.BUTTON_DUPLICATE', 'Duplicate'),
                disabled: inProgress,
                onClick: () => {
                    handleActions('DUPLICATE-QUERY');
                },
                iconProps: {
                    iconName: 'fa-clone'
                }
            },
            {
                key: 'delete',
                text: translate('text.BUTTON_REMOVE', 'Remove'),
                disabled: inProgress,
                onClick: () => {
                    handleActions('REMOVE-QUERY');
                },
                iconProps: {
                    iconName: 'fa-trash'
                }
            },
            {
                key: 'divider_query',
                itemType: ContextualMenuItemType.Divider,
                onRender: commandBarUtils.renderDivider
            },
            {
                key: 'test-query',
                text: translate('text.BUTTON_TEST_QUERY', 'Test Query'),
                onClick: () => {
                    handleActions('TEST-QUERY');
                },
                iconProps: {
                    iconName: editHasSpinner ? 'fa-spinner' : 'fa-play'
                }
            }
        );

        return itemCommands;
    }

    function getMultiSelectionCommands(items: IDataQueryExampleQuery[]): ICommandBarItemProps[] {
        if (!items.length) {
            return [];
        }

        let inProgress = false;

        for (const item of items) {
            if (!item.id) {
                continue;
            }

            if (!inProgress) {
                inProgress = !!dataQueryStates?.[item.id]?.isTesting;
            }
        }

        const itemCommands: ICommandBarItemProps[] = [];

        itemCommands.push({
            key: 'delete',
            text: translate('text.BUTTON_REMOVE', 'Remove'),
            disabled: inProgress,
            onClick: () => {
                handleActions('REMOVE-QUERY');
            },
            iconProps: {
                iconName: 'fa-trash'
            }
        });

        return itemCommands;
    }

    function handleConfigChange(newConfig?: IDataQueryExampleConfig) {
        if (!newConfig) {
            return;
        }

        setConfig(newConfig);
    }

    function handleActions(
        type:
            | 'ADD-SOURCE'
            | 'EDIT-SOURCE'
            | 'CLONE-SOURCE'
            | 'REMOVE-SOURCE'
            | 'ADD-QUERY'
            | 'EDIT-QUERY'
            | 'DUPLICATE-QUERY'
            | 'REMOVE-QUERY'
            | 'TEST-QUERY'
    ) {
        switch (type) {
            case 'ADD-SOURCE':
                setDataQueryExampleSourceDialogConfig({
                    show: true,
                    actionType: 'NEW',
                    systemInfo,
                    config: {
                        id: uuidv4()
                    },
                    blockedNames: config.sources?.flatMap((source) => source.name ?? ''),
                    sources: config.sources
                });

                break;

            case 'CLONE-SOURCE':
                setDataQueryExampleSourceDialogConfig({
                    show: true,
                    actionType: 'DUPLICATE',
                    systemInfo,
                    config: {
                        ...selectedSource,
                        id: uuidv4(),
                        name: ''
                    },
                    blockedNames: config.sources?.flatMap((source) => source.name ?? ''),
                    sources: config.sources
                });

                break;

            case 'EDIT-SOURCE':
                setDataQueryExampleSourceDialogConfig({
                    show: true,
                    actionType: 'EDIT',
                    systemInfo,
                    config: selectedSource,
                    blockedNames: config.sources
                        ?.filter((source) => source.id?.toLowerCase() !== selectedSource?.id?.toLowerCase())
                        ?.flatMap((source) => source.name ?? ''),
                    sources: config.sources?.filter(
                        (source) => source.id?.toLowerCase() !== selectedSource?.id?.toLowerCase()
                    )
                });

                break;

            case 'REMOVE-SOURCE':
                {
                    if (!selectedSource) {
                        return;
                    }

                    setSourceDeleteDialogConfig({
                        show: true,
                        items: [selectedSource]
                    });
                }
                break;

            case 'ADD-QUERY':
                {
                    if (!selectedSource) {
                        return;
                    }

                    setDataQueryExampleQueryPanelConfig({
                        show: true,
                        actionType: 'NEW',
                        source: selectedSource,
                        config: {
                            ...defaultQueryConfig,
                            id: uuidv4()
                        },
                        blockedNames: selectedSource?.queries?.flatMap((item) => item.name ?? '')
                    });
                }
                break;

            case 'DUPLICATE-QUERY':
                {
                    if (!selectedItemIds.length || selectedItemIds.length > 1) {
                        return;
                    }

                    const query = selectedSource?.queries?.find(
                        (query) => query.id?.toLowerCase() === selectedItemIds[0]?.toLowerCase()
                    );

                    if (!query) {
                        return;
                    }

                    setDataQueryExampleQueryPanelConfig({
                        show: true,
                        actionType: 'DUPLICATE',
                        source: selectedSource,
                        config: {
                            ...query,
                            id: uuidv4(),
                            name: ''
                        },
                        blockedNames: selectedSource?.queries?.flatMap((item) => item.name ?? '')
                    });
                }
                break;

            case 'EDIT-QUERY':
                {
                    if (!selectedItemIds.length || selectedItemIds.length > 1) {
                        return;
                    }

                    const query = selectedSource?.queries?.find(
                        (query) => query.id?.toLowerCase() === selectedItemIds[0]?.toLowerCase()
                    );

                    if (!query) {
                        return;
                    }

                    setDataQueryExampleQueryPanelConfig({
                        show: true,
                        actionType: 'OPEN',
                        source: selectedSource,
                        config: query,
                        blockedNames: selectedSource?.queries
                            ?.filter((search) => search.id?.toLowerCase() !== query.id?.toLowerCase())
                            .flatMap((item) => item.name ?? '')
                    });
                }
                break;

            case 'REMOVE-QUERY':
                {
                    if (!selectedItemIds.length || selectedItemIds.length > 1) {
                        return;
                    }

                    const queries = selectedSource?.queries?.filter((query) =>
                        selectedItemIds.some((searchId) => searchId.toLowerCase() === query.id?.toLowerCase())
                    );

                    if (!queries?.length) {
                        return;
                    }

                    setQueryDeleteDialogConfig({
                        show: true,
                        items: queries
                    });
                }
                break;

            case 'TEST-QUERY':
                {
                    if (!selectedItemIds.length || selectedItemIds.length > 1) {
                        return;
                    }

                    const query = selectedSource?.queries?.find(
                        (query) => query.id?.toLowerCase() === selectedItemIds[0]?.toLowerCase()
                    );

                    if (!query) {
                        return;
                    }

                    handleTestQuery(query);
                }
                break;
        }
    }

    function handleSourceDeleteDialogDismissed() {
        setSourceDeleteDialogConfig(undefined);
    }

    function handleSourceDeleteDialogDismiss() {
        setSourceDeleteDialogConfig({
            show: false,
            items: undefined
        });

        handleSourceDeleteDialogDismissed();
    }

    function handleSourceDeleteDialogSubmit(items?: IDataQueryExampleSource[]) {
        handleSourceDeleteDialogDismiss();

        if (!items?.length) {
            return;
        }

        const newSource = [...(config.sources ?? [])];

        items?.forEach((item) => {
            const index = newSource.findIndex((source) => source.id?.toLowerCase() === item.id?.toLowerCase());

            if (index > -1) {
                newSource.splice(index, 1);
            }
        });

        setConfig({
            ...config,
            sources: newSource
        });

        setSelectedSource(undefined);
    }

    function handleDataQueryExampleSourceDialogDismissed() {
        setDataQueryExampleSourceDialogConfig(undefined);
    }

    function handleDataQueryExampleSourceDialogDismiss() {
        setDataQueryExampleSourceDialogConfig({
            show: false,
            config: undefined
        });

        handleDataQueryExampleSourceDialogDismissed();
    }

    function handleDataQueryExampleSourceDialogSubmit(newConfig?: IDataQueryExampleSource) {
        if (!newConfig) {
            return;
        }

        const newSources = [...(config.sources ?? [])];

        const index = newSources.findIndex((source) => source.id?.toLowerCase() === newConfig.id?.toLowerCase());

        if (index >= 0) {
            newSources[index] = {
                ...newConfig
            };
        } else {
            newSources.push(newConfig);
        }

        setConfig({
            ...config,
            sources: newSources
        });

        handleDataQueryExampleSourceDialogDismiss();
    }

    function handleDataQueryExampleQueryPanelDismiss() {
        setDataQueryExampleQueryPanelConfig(undefined);
    }

    function handleTestQuery(
        queryItem?: IDataQueryExampleQuery,
        ignoreMapping?: boolean,
        callback?: (status: boolean, reason?: string, result?: IResultTable) => void
    ) {
        if (!queryItem) {
            return;
        }

        const isTesting = !!dataQueryStates[queryItem?.id ?? '']?.isTesting;

        if (isTesting) {
            return;
        }

        const queryState = (dataQueryStates[queryItem?.id ?? ''] ??= {});

        queryState.isTesting = true;

        setDataQueryStates({
            ...dataQueryStates,
            [queryItem?.id ?? '']: queryState
        });

        try {
            // First define query item for execution
            const sdkQueryItem: IQueryItem = {
                addin_id: ADD_IN_ID,
                module_id: MODULE_ID,
                module: 'Example',
                type: QueryType.Reader,
                name: `${selectedSource?.name || ''}${DATA_SOURCE_QUERY_DELIMITER}${queryItem.name || ''}`,
                condition_fields: [],
                fields: []
            };

            // Set condition fields
            sdkQueryItem.condition_fields = [...sdkHelper.getIdxFields(queryItem.query || '')];

            // Set fields
            if (!ignoreMapping) {
                sdkQueryItem.fields = [
                    ...(queryItem?.field_mappings?.map((field) => {
                        return field?.name || '';
                    }) || [])
                ];
            }

            const testSource: IDataQueryExampleSource = {
                ...selectedSource,
                queries: []
            };

            if (ignoreMapping === true) {
                testSource.queries?.push({
                    ...queryItem,
                    field_mappings: []
                });
            } else {
                testSource.queries?.push(queryItem);
            }

            const testConfig = {
                ...config,
                sources: [testSource]
            };

            const configItem = {
                credentials: systemInfo?.credentials,
                parameters: {
                    [CONFIG_KEY]: JSON.stringify(testConfig)
                }
            };

            DesignerAPI.dataQueryAddin.test(
                sdkQueryItem,
                configItem,
                (status: boolean, reason?: string, result?: IResultTable) => {
                    callback?.(status, reason, result);

                    queryState.isTesting = false;

                    setDataQueryStates({
                        ...dataQueryStates,
                        [queryItem?.id ?? '']: queryState
                    });
                }
            );
        } catch (ex) {
            console.error(ex);
            callback?.(false, undefined, undefined);

            queryState.isTesting = false;

            setDataQueryStates({
                ...dataQueryStates,
                [queryItem?.id ?? '']: queryState
            });
        }
    }

    function handleDataQueryExampleQueryPanelSubmit(newConfig: IDataQueryExampleQuery) {
        handleDataQueryExampleQueryPanelDismiss();

        if (!newConfig) {
            return;
        }

        if (!selectedSource) {
            return;
        }

        const newQueries = [...(selectedSource.queries ?? [])];
        const index = newQueries.findIndex((query) => query.id?.toLowerCase() === newConfig.id?.toLowerCase());

        if (index >= 0) {
            newQueries[index] = {
                ...newConfig
            };
        } else {
            newQueries.push(newConfig);
        }

        const newSources = [...(config.sources ?? [])];
        const sourceIndex = newSources.findIndex(
            (source) => source.id?.toLowerCase() === selectedSource.id?.toLowerCase()
        );

        if (sourceIndex === undefined || sourceIndex < 0) {
            return;
        }

        newSources[sourceIndex] = {
            ...selectedSource,
            queries: newQueries
        };

        setConfig({
            ...config,
            sources: newSources
        });

        setSelectedSource(newSources[sourceIndex]);
    }

    function handleSourceQueryDeleteDialogDismissed() {
        setQueryDeleteDialogConfig(undefined);
    }

    function handleSourceQueryDeleteDialogDismiss() {
        setQueryDeleteDialogConfig({
            show: false,
            items: undefined
        });

        handleSourceQueryDeleteDialogDismissed();
    }

    function handleSourceQueryDeleteDialogSubmit(items?: IDataQueryExampleSource[]) {
        handleSourceQueryDeleteDialogDismiss();

        if (!items?.length) {
            return;
        }

        if (!selectedSource) {
            return;
        }

        const newQueries = [...(selectedSource.queries ?? [])];

        items?.forEach((item) => {
            const index = newQueries.findIndex((query) => query.id?.toLowerCase() === item.id?.toLowerCase());

            if (index > -1) {
                newQueries.splice(index, 1);
            }
        });

        const newSources = [...(config.sources ?? [])];
        const sourceIndex = newSources.findIndex(
            (source) => source.id?.toLowerCase() === selectedSource.id?.toLowerCase()
        );

        if (sourceIndex === undefined || sourceIndex < 0) {
            return;
        }

        newSources[sourceIndex] = {
            ...selectedSource,
            queries: newQueries
        };

        setConfig({
            ...config,
            sources: newSources
        });

        setSelectedSource(newSources[sourceIndex]);
    }

    return (
        <Fragment>
            <AddInContentLayout
                commands={[...topNavigation]}
                title={translate('text.TITLE_DATA_QUERY_MANAGEMENT', 'Data Query Management')}>
                <AddInContentWithItemList
                    navigation={dataQuerySourceNav}
                    noItemsInfo={translate(
                        'text.WARNING_NO_DATA_SOURCES',
                        'No data sources were found or configured. Start the configuration by adding a new data source'
                    )}
                    selectedKey={selectedSource?.id}
                    onRenderTooltip={renderDataSourceTooltip}
                    onSelectItem={(item: unknown) => {
                        setSelectedSource(item as IDataQueryExampleSource);
                    }}>
                    {selectedSource ? (
                        <DataQueryExampleQueries
                            selectedSource={selectedSource}
                            config={config}
                            systemInfo={systemInfo}
                            selectedItemIds={selectedItemIds}
                            selectionCommands={selectionCommands}
                            onOpen={() => handleActions('EDIT-QUERY')}
                            onChange={handleConfigChange}
                            onChangeDataQuerySelection={setSelectedItemIds}
                        />
                    ) : (
                        <Stack
                            verticalAlign='center'
                            style={{
                                paddingTop: '3.125rem',
                                opacity: '0.5'
                            }}>
                            <Text
                                variant='large'
                                style={{
                                    textAlign: 'center'
                                }}>
                                {translate(
                                    'text.WARNING_NO_DATA_SOURCE_SELECTED',
                                    'No data source selected. Selected a data source or create a new one'
                                )}
                            </Text>
                        </Stack>
                    )}
                </AddInContentWithItemList>
            </AddInContentLayout>

            {dataQuerySearchSourceDialogConfig?.show === true && (
                <DataQueryExampleSourceDialog
                    hidden={!dataQuerySearchSourceDialogConfig.show}
                    actionType={dataQuerySearchSourceDialogConfig.actionType}
                    config={dataQuerySearchSourceDialogConfig?.config}
                    blockedNames={dataQuerySearchSourceDialogConfig?.blockedNames}
                    sources={dataQuerySearchSourceDialogConfig?.sources}
                    systemInfo={systemInfo}
                    onDismiss={handleDataQueryExampleSourceDialogDismiss}
                    onSubmit={handleDataQueryExampleSourceDialogSubmit}
                    modalProps={{
                        onDismissed: handleDataQueryExampleSourceDialogDismissed
                    }}
                />
            )}

            {sourceDeleteDialogConfig?.show === true && (
                <DataQueryExampleDeleteDialog
                    hidden={!sourceDeleteDialogConfig.show}
                    items={sourceDeleteDialogConfig.items}
                    onDismiss={handleSourceDeleteDialogDismiss}
                    onSubmit={handleSourceDeleteDialogSubmit}
                    modalProps={{
                        onDismissed: handleSourceDeleteDialogDismissed
                    }}
                />
            )}

            {dataQuerySearchQueryPanelConfig?.show === true && (
                <DataQueryExampleQueryConfigStatePanel
                    isOpen={dataQuerySearchQueryPanelConfig.show}
                    source={dataQuerySearchQueryPanelConfig.source}
                    config={dataQuerySearchQueryPanelConfig.config}
                    actionType={dataQuerySearchQueryPanelConfig.actionType}
                    systemInfo={systemInfo}
                    blockedNames={dataQuerySearchQueryPanelConfig.blockedNames}
                    type={PanelType.large}
                    onTest={handleTestQuery}
                    onDismiss={handleDataQueryExampleQueryPanelDismiss}
                    onDismissed={handleDataQueryExampleQueryPanelDismiss}
                    onSubmitAction={handleDataQueryExampleQueryPanelSubmit}
                />
            )}

            {queryDeleteDialogConfig?.show === true && (
                <DataQueryExampleQueryDeleteDialog
                    hidden={!queryDeleteDialogConfig.show}
                    items={queryDeleteDialogConfig.items}
                    onDismiss={handleSourceQueryDeleteDialogDismiss}
                    onSubmit={handleSourceQueryDeleteDialogSubmit}
                    modalProps={{
                        onDismissed: handleSourceQueryDeleteDialogDismissed
                    }}
                />
            )}
        </Fragment>
    );
};

