import {
    AddInContentLayout,
    AddInContentWithItemList,
    FullSpinner,
    commandBarUtils,
    sdkHelper,
    stringUtils
} from '@actiwaredevelopment/io-sdk-react';
import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';
import {
    FieldType,
    IHttpCredential,
    IItemConfig,
    IQueryItem,
    ISyntaxFieldCategory,
    QueryType,
    ReportLevel
} from '@actiwaredevelopment/io-sdk-typescript-models';
import { ContextualMenuItemType, ICommandBarItemProps, PanelType, Stack, Text, useTheme } from '@fluentui/react';
import { cloneDeep } from 'lodash';
import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { HTTP_CREDENTIAL_STORE_ID, MODULE_ID } from '../../../models';
import { credentialUtils } from '../../../utils';
import {
    ADD_IN_ID,
    ALTERNATIVE_CONFIG_KEY,
    CONFIG_KEY,
    convertToItemConfig,
    DATA_SOURCE_QUERY_DELIMITER,
    getDefaultDataQueryConfig,
    getDefaultSourceConfig,
    upgradeConfig
} from '../config';
import {
    DataQuerySourceDeleteDialog,
    DataQueryDeleteDialog,
    DataQuerySourceDialog,
    IDataQuerySourceDeleteDialogConfig,
    IDataQueryDeleteDialogConfig,
    IDataQuerySourceDialogConfig
} from '../dialogs';
import { IDataQueryExampleConfig, IDataQueryExampleQuery, IDataQueryExampleSource, IDataQueryStates } from '../models';
import { useDataQuerySourceNav } from '../hooks';
import { DataQueryConfigPanel, IDataQueryConfigPanelConfig } from '../panels';
import { DataQueryQueries } from './data-query-example-queries';
import { DataQuerySourceTooltip } from './data-query-example-source-tooltip';

const EXAMPLE_QUERY_FIELDS = ['First Field', 'Second Field', 'Third Field'];
const SYSTEM_INFO_REQUEST: DesignerAPI.ISystemInfoRequest = {
    mode: DesignerAPI.SystemInfo.ContextMenuItems | DesignerAPI.SystemInfo.Credentials,
    credential_store_filter: [HTTP_CREDENTIAL_STORE_ID],
    context_menu_items:
        FieldType.Parameter | FieldType.DataField | FieldType.Variable | FieldType.NodeField | FieldType.Plugins
};

export const DataQueryConfig: React.FunctionComponent = () => {
    const theme = useTheme();
    const { t: translate } = useTranslation();

    const [apiInitialized, setApiInitialized] = useState<boolean>(false);
    const [config, setConfig] = useState<IDataQueryExampleConfig>(() => getDefaultDataQueryConfig());
    const [contextMenuItems, setContextMenuItems] = useState<ISyntaxFieldCategory[]>([]);
    const [dataQuerySearchQueryPanelConfig, setDataQueryExampleQueryPanelConfig] =
        useState<IDataQueryConfigPanelConfig>();
    const [dataQuerySearchSourceDialogConfig, setDataQueryExampleSourceDialogConfig] =
        useState<IDataQuerySourceDialogConfig>();
    const [dataQueryStates, setDataQueryStates] = useState<IDataQueryStates>({});
    const [loginProfiles, setLoginProfiles] = useState<IHttpCredential[]>([]);
    const [queryDeleteDialogConfig, setQueryDeleteDialogConfig] = useState<IDataQueryDeleteDialogConfig>();
    const [isSaving, setSaving] = useState<boolean>(false);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [selectedSource, setSelectedSource] = useState<IDataQueryExampleSource | undefined>();
    const [sourceDeleteDialogConfig, setSourceDeleteDialogConfig] = useState<IDataQuerySourceDeleteDialogConfig>();

    const dataQuerySourceNav = useDataQuerySourceNav(config.sources ?? []);

    const handleLoad = useCallback((configItem?: IItemConfig, systemInfo?: DesignerAPI.ISystemInfoResponse) => {
        let config: IDataQueryExampleConfig = getDefaultDataQueryConfig();
        const configStr = configItem?.parameters?.[CONFIG_KEY] ?? configItem?.parameters?.[ALTERNATIVE_CONFIG_KEY];

        if (configStr) {
            try {
                config = JSON.parse(configStr);
            } catch (error) {
                console.error(error);
            }
        }

        const contextMenuItems = systemInfo?.context_menus ?? [];
        const httpLoginProfiles = credentialUtils.parseHttpCredentials(systemInfo?.credentials ?? []);
        const upgradedConfig = upgradeConfig(config);

        setApiInitialized(true);
        setConfig(upgradedConfig);
        setContextMenuItems(contextMenuItems);
        setLoginProfiles(httpLoginProfiles);
    }, []);

    const handleSave = useCallback(() => {
        setSaving(true);

        let itemConfig: IItemConfig | undefined;

        try {
            itemConfig = convertToItemConfig(config);
        } catch {
            console.error('Error while serializing configuration');
        }

        // If we do not have an ItemConfig at this point, the serialization must have failed.
        // We can display the error in the IO Web Designer.
        if (!itemConfig) {
            DesignerAPI.system.sendNotification({
                errorCode: 'CONFIG_SERIALIZATION_ERROR',
                level: ReportLevel.Error,
                text: translate('text.ITEMCONFIG_NOT_PRESENT', 'Config could not be created. Serialization failed.'),
                title: translate('text.SERIALIZATION_ERROR', 'Serialization Error')
            });

            return;
        }

        DesignerAPI.dataQueryAddin.saveConfig(itemConfig, () => setSaving(false));
    }, [config, translate]);

    const handleSystemInfoUpdate = useCallback((updateEvent?: DesignerAPI.IUpdateEvent) => {
        if (!updateEvent?.result) {
            return;
        }

        const systemInfo = updateEvent.result;

        if (systemInfo.mode === DesignerAPI.SystemInfo.ContextMenuItems) {
            setContextMenuItems(systemInfo.context_menus ?? []);
        }

        if (systemInfo.mode === DesignerAPI.SystemInfo.Credentials) {
            const httpLoginProfiles = credentialUtils.parseHttpCredentials(systemInfo.credentials ?? []);

            setLoginProfiles(httpLoginProfiles);
        }
    }, []);

    // Load Designer API and credential store config
    useEffect(() => {
        if (apiInitialized) {
            return;
        }

        DesignerAPI.initialize(() => DesignerAPI.dataQueryAddin.loadConfig(SYSTEM_INFO_REQUEST, handleLoad));
    }, [apiInitialized, handleLoad]);

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

    // Preselect first source
    useEffect(() => {
        if (selectedSource || !config?.sources?.[0]) {
            return;
        }

        setSelectedSource(config.sources[0]);
    }, [config, selectedSource]);

    const topNavigation: ICommandBarItemProps[] = [
        {
            disabled: isSaving,
            key: 'save',
            onClick: handleSave,
            onRenderIcon: commandBarUtils.renderCommandBarItemIconWithSpinner,
            showSpinner: isSaving,
            text: translate('text.BUTTON_SAVE', 'Save'),
            iconProps: {
                iconName: 'fa-save',
                styles: {
                    root: {
                        minWidth: '1rem'
                    }
                }
            }
        },
        {
            itemType: ContextualMenuItemType.Divider,
            key: 'divider_save',
            onRender: commandBarUtils.renderDivider
        },
        {
            disabled: isSaving,
            key: 'add-source',
            onClick: handleAddSource,
            text: translate('text.BUTTON_ADD_SOURCE', 'Add Source'),
            iconProps: {
                iconName: 'fa-plus'
            }
        },
        {
            disabled: !selectedSource || isSaving,
            key: 'edit-source',
            onClick: handleEditSource,
            text: translate('text.BUTTON_EDIT', 'Edit'),
            iconProps: {
                iconName: 'fa-pen'
            }
        },
        {
            disabled: !selectedSource || isSaving,
            key: 'clone-source',
            onClick: handleCloneSource,
            text: translate('text.BUTTON_DUPLICATE', 'Duplicate'),
            iconProps: {
                iconName: 'fa-clone'
            }
        },
        {
            disabled: !selectedSource || isSaving,
            key: 'remove-source',
            onClick: handleRemoveSource,
            text: translate('text.BUTTON_REMOVE', 'Remove'),
            iconProps: {
                iconName: 'fa-trash'
            }
        },
        {
            itemType: ContextualMenuItemType.Divider,
            key: 'divider_source',
            onRender: commandBarUtils.renderDivider
        },
        {
            disabled: !selectedSource || isSaving,
            key: 'add-query',
            onClick: handleAddQuery,
            text: translate('text.BUTTON_ADD_QUERY', 'Add Query'),
            iconProps: {
                iconName: 'fa-plus'
            }
        }
    ];

    let selectionCommands: ICommandBarItemProps[] = [];

    if (selectedSource?.queries) {
        if (selectedItemIds.length === 1) {
            const dataQuery = selectedSource.queries.find((query) => query.id === selectedItemIds?.[0]);

            selectionCommands = getSingleSelectionCommands(dataQuery);
        } else if (selectedItemIds.length > 1) {
            const dataQueries = selectedSource.queries.filter((query) =>
                selectedItemIds?.some((search) => search === query.id)
            );

            selectionCommands = getMultiSelectionCommands(dataQueries);
        }

        if (selectionCommands.length) {
            topNavigation.push({
                itemType: ContextualMenuItemType.Divider,
                key: 'divider_selection',
                onRender: commandBarUtils.renderDivider
            });
        }

        topNavigation.push(...selectionCommands);
    }

    function executeQueryTest(queryItem?: IDataQueryExampleQuery, ignoreMapping?: boolean) {
        if (!queryItem?.id || !queryItem.name || !queryItem.query || !selectedSource?.name) {
            return;
        }

        const isTesting = !!dataQueryStates[queryItem.id]?.isTesting;

        if (isTesting) {
            return;
        }

        const queryState = (dataQueryStates[queryItem.id] ??= {});

        queryState.isTesting = true;

        setDataQueryStates((current) => ({
            ...current,
            [queryItem.id ?? '']: queryState
        }));

        try {
            // First define query item for execution
            const sdkQueryItem: IQueryItem = {
                addin_id: ADD_IN_ID,
                module_id: MODULE_ID,
                module: 'Template Module',
                type: QueryType.Reader,
                name: `${selectedSource.name}${DATA_SOURCE_QUERY_DELIMITER}${queryItem.name}`,
                condition_fields: [],
                fields: []
            };

            // Set condition fields
            sdkQueryItem.condition_fields = [...sdkHelper.getIdxFields(queryItem.query)];

            // Set fields
            if (!ignoreMapping) {
                const fields = (queryItem.field_mappings ?? []).flatMap((field) => (field.name ? [field.name] : []));

                sdkQueryItem.fields = fields;
            }

            const testSource: IDataQueryExampleSource = {
                ...selectedSource,
                queries: []
            };

            if (ignoreMapping) {
                testSource.queries?.push({
                    ...queryItem,
                    field_mappings: []
                });
            } else {
                testSource.queries?.push(queryItem);
            }

            const testConfig: IDataQueryExampleConfig = {
                ...config,
                sources: [testSource]
            };

            const configItem: IItemConfig = {
                credentials: [],
                parameters: {
                    [CONFIG_KEY]: JSON.stringify(testConfig)
                }
            };

            DesignerAPI.dataQueryAddin.test(sdkQueryItem, configItem, () => {
                queryState.isTesting = false;

                setDataQueryStates((current) => ({
                    ...current,
                    [queryItem.id ?? '']: queryState
                }));
            });
        } catch (error) {
            console.error(error);

            queryState.isTesting = false;

            setDataQueryStates((current) => ({
                ...current,
                [queryItem.id ?? '']: queryState
            }));
        }
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

            inProgress = !!dataQueryStates?.[item.id]?.isTesting || isSaving;

            // We only need one item to indicate progress
            if (inProgress) {
                break;
            }
        }

        const itemCommands: ICommandBarItemProps[] = [];

        itemCommands.push({
            disabled: inProgress,
            key: 'delete',
            onClick: handleRemoveQuery,
            text: translate('text.BUTTON_REMOVE', 'Remove'),
            iconProps: {
                iconName: 'fa-trash'
            }
        });

        return itemCommands;
    }

    function getSingleSelectionCommands(item?: IDataQueryExampleQuery): ICommandBarItemProps[] {
        if (!item?.id) {
            return [];
        }

        const isTesting = !!dataQueryStates?.[item.id]?.isTesting;
        const inProgress = isTesting || isSaving;

        const itemCommands: ICommandBarItemProps[] = [];

        itemCommands.push(
            {
                disabled: inProgress,
                key: 'edit-query',
                onClick: handleEditQuery,
                text: translate('text.BUTTON_EDIT', 'Edit'),
                iconProps: {
                    iconName: 'fa-pen'
                }
            },
            {
                disabled: inProgress,
                key: 'duplicate',
                onClick: handleCloneQuery,
                text: translate('text.BUTTON_DUPLICATE', 'Duplicate'),
                iconProps: {
                    iconName: 'fa-clone'
                }
            },
            {
                disabled: inProgress,
                key: 'delete',
                onClick: handleRemoveQuery,
                text: translate('text.BUTTON_REMOVE', 'Remove'),
                iconProps: {
                    iconName: 'fa-trash'
                }
            },
            {
                itemType: ContextualMenuItemType.Divider,
                key: 'divider_query',
                onRender: commandBarUtils.renderDivider
            },
            {
                disabled: inProgress,
                key: 'test-query',
                onClick: handleTestQuery,
                onRenderIcon: commandBarUtils.renderCommandBarItemIconWithSpinner,
                showSpinner: isTesting,
                text: translate('text.BUTTON_TEST_QUERY', 'Test Query'),
                iconProps: {
                    iconName: 'fa-play',
                    styles: {
                        root: {
                            minWidth: '1rem'
                        }
                    }
                }
            }
        );

        return itemCommands;
    }

    function handleAddQuery() {
        if (!selectedSource) {
            return;
        }

        const blockedNames = (selectedSource.queries ?? []).flatMap((query) => (query.name ? [query.name] : []));
        const newConfig = getDefaultSourceConfig();

        setDataQueryExampleQueryPanelConfig({
            show: true,
            panelType: 'NEW',
            config: newConfig,
            blockedNames: blockedNames
        });
    }

    function handleAddSource() {
        const blockedNames = (config.sources ?? []).flatMap((source) => (source.name ? [source.name] : []));
        const newConfig = getDefaultSourceConfig();

        setDataQueryExampleSourceDialogConfig({
            show: true,
            actionType: 'NEW',
            config: newConfig,
            blockedNames: blockedNames,
            sources: config.sources ?? []
        });
    }

    function handleCloneQuery() {
        if (selectedItemIds.length !== 1 || !selectedSource?.queries) {
            return;
        }

        const query = selectedSource.queries.find((query) => query.id === selectedItemIds[0]);

        if (!query) {
            return;
        }

        // Use cloneDeep to prevent a shallow copy of the object. A shallow copy might produce unexpected behaviour.
        const queryCopy = cloneDeep(query);
        const blockedNames = selectedSource.queries.flatMap((item) => (item.name ? [item.name] : []));
        const newName = stringUtils.uniqueName(query.name ?? '', blockedNames);

        queryCopy.id = uuidv4();
        queryCopy.name = newName;

        setDataQueryExampleQueryPanelConfig({
            blockedNames: blockedNames,
            config: queryCopy,
            panelType: 'DUPLICATE',
            show: true
        });
    }

    function handleCloneSource() {
        if (!selectedSource) {
            return;
        }

        const sources = config.sources ?? [];
        const blockedNames = sources.flatMap((source) => (source.name ? [source.name] : []));
        const newName = stringUtils.uniqueName(selectedSource.name ?? '', blockedNames);

        // Use cloneDeep to prevent a shallow copy of the object. A shallow copy might produce unexpected behaviour.
        const sourceCopy: IDataQueryExampleSource = cloneDeep(selectedSource);

        sourceCopy.id = uuidv4();
        sourceCopy.name = newName;

        setDataQueryExampleSourceDialogConfig({
            show: true,
            actionType: 'DUPLICATE',
            config: sourceCopy,
            blockedNames: blockedNames,
            sources: sources
        });
    }

    function handleEditQuery() {
        if (selectedItemIds.length !== 1 || !selectedSource?.queries) {
            return;
        }

        const selectedId = selectedItemIds[0];
        const query = selectedSource.queries.find((query) => query.id === selectedId);

        if (!query) {
            return;
        }

        const blockedNames = selectedSource.queries.flatMap((query) =>
            query.name && query.id !== selectedId ? [query.name] : []
        );

        setDataQueryExampleQueryPanelConfig({
            blockedNames: blockedNames,
            config: query,
            panelType: 'OPEN',
            show: true
        });
    }

    function handleEditSource() {
        if (!selectedSource?.id) {
            return;
        }

        const sources = config.sources ?? [];
        const filteredSources = sources.filter((source) => source.id !== selectedSource?.id);
        const blockedNames = filteredSources.flatMap((source) => (source.name ? [source.name] : []));

        setDataQueryExampleSourceDialogConfig({
            show: true,
            actionType: 'EDIT',
            config: selectedSource,
            blockedNames: blockedNames,
            sources: filteredSources
        });
    }

    function handleNavSelection(source: unknown) {
        if (!source) {
            return;
        }

        setSelectedSource(source);
    }

    function handleQueryDeleteDialogDismiss() {
        setQueryDeleteDialogConfig(undefined);
    }

    function handleQueryPanelDismiss() {
        setDataQueryExampleQueryPanelConfig(undefined);
    }

    function handleQueryPanelSubmit(newConfig: IDataQueryExampleQuery) {
        if (!selectedSource?.queries) {
            return;
        }

        const newSources = [...(config.sources ?? [])];
        const sourceIndex = newSources.findIndex((source) => source.id === selectedSource.id);

        if (sourceIndex < 0) {
            return;
        }

        const newQueries = [...selectedSource.queries];
        const index = newQueries.findIndex((query) => query.id === newConfig.id);

        if (index >= 0) {
            newQueries[index] = newConfig;
        } else {
            newQueries.push(newConfig);
        }

        newSources[sourceIndex] = {
            ...selectedSource,
            queries: newQueries
        };

        setSelectedSource(newSources[sourceIndex]);
        setConfig((current) => ({
            ...current,
            sources: newSources
        }));

        handleQueryPanelDismiss();
    }

    function handleRemoveQuery() {
        if (selectedItemIds.length <= 0 || !selectedSource?.queries) {
            return;
        }

        const queries = selectedSource.queries.filter((query) =>
            selectedItemIds.some((searchId) => searchId === query.id)
        );

        if (!queries.length) {
            return;
        }

        setQueryDeleteDialogConfig({
            show: true,
            queries: queries
        });
    }

    function handleRemoveSource() {
        if (!selectedSource) {
            return;
        }

        setSourceDeleteDialogConfig({
            show: true,
            sources: [selectedSource]
        });
    }

    function handleSourceDeleteDialogDismiss() {
        setSourceDeleteDialogConfig(undefined);
    }

    function handleSourceDeleteDialogSubmit(sources: IDataQueryExampleSource[]) {
        if (!config.sources) {
            return;
        }

        const newSources = [...config.sources];

        for (const source of sources) {
            const index = newSources.findIndex((src) => src.id === source.id);

            if (index > -1) {
                newSources.splice(index, 1);
            }
        }

        setSelectedSource(undefined);
        setConfig((current) => ({
            ...current,
            sources: newSources
        }));

        handleSourceDeleteDialogDismiss();
    }

    function handleSourceDialogDimiss() {
        setDataQueryExampleSourceDialogConfig(undefined);
    }

    function handleSourceDialogSubmit(newSource: IDataQueryExampleSource) {
        const newSources = [...(config.sources ?? [])];
        const index = newSources.findIndex((source) => source.id === newSource.id);

        if (index >= 0) {
            newSources[index] = newSource;
        } else {
            newSources.push(newSource);
        }

        setSelectedSource(newSource);
        setConfig((current) => ({
            ...current,
            sources: newSources
        }));

        handleSourceDialogDimiss();
    }

    function handleSourceQueryDeleteDialogSubmit(queries: IDataQueryExampleSource[]) {
        if (!selectedSource?.id) {
            return;
        }

        const newSources = [...(config.sources ?? [])];
        const sourceIndex = newSources.findIndex((source) => source.id === selectedSource.id);

        if (sourceIndex < 0) {
            return;
        }

        const newQueries = [...(selectedSource.queries ?? [])];

        for (const query of queries) {
            const index = newQueries.findIndex((q) => q.id === query.id);

            if (index > -1) {
                newQueries.splice(index, 1);
            }
        }

        newSources[sourceIndex] = {
            ...selectedSource,
            queries: newQueries
        };

        setSelectedSource(newSources[sourceIndex]);
        setConfig((current) => ({
            ...current,
            sources: newSources
        }));

        handleQueryDeleteDialogDismiss();
    }

    function handleSourceTooltipRender(item: unknown): JSX.Element {
        if (!item) {
            return <></>;
        }

        const source = item as IDataQueryExampleSource;
        const loginProfile = loginProfiles.find((profile) => profile.id === source.login_profile);

        if (!loginProfile) {
            return <></>;
        }

        return <DataQuerySourceTooltip credential={loginProfile} />;
    }

    function handleTestQuery() {
        if (selectedItemIds.length !== 1 || !selectedSource?.queries) {
            return;
        }

        const query = selectedSource.queries.find((query) => query.id === selectedItemIds[0]);

        if (!query) {
            return;
        }

        executeQueryTest(query);
    }

    if (!apiInitialized) {
        return <FullSpinner />;
    }

    return (
        <AddInContentLayout
            commands={topNavigation}
            title={translate('text.TEMPLATE_EXAMPLE_QUERY_TITLE', 'Example Data Source Management')}>
            <AddInContentWithItemList
                navigation={dataQuerySourceNav}
                onRenderTooltip={handleSourceTooltipRender}
                onSelectItem={handleNavSelection}
                selectedKey={selectedSource?.id}
                noItemsInfo={translate(
                    'text.WARNING_NO_EXAMPLE_DATA_SOURCES',
                    'No example data sources were found or configured. Start the configuration by adding a new data source'
                )}>
                {selectedSource?.queries && (
                    <DataQueryQueries
                        onChangeDataQuerySelection={setSelectedItemIds}
                        onEdit={handleEditQuery}
                        queries={selectedSource.queries}
                        selectionCommands={selectionCommands}
                    />
                )}

                {!selectedSource?.queries && (
                    <Stack
                        verticalAlign='center'
                        horizontalAlign='center'>
                        <Text
                            variant='large'
                            styles={{
                                root: {
                                    textAlign: 'center',
                                    color: theme.semanticColors.disabledText,
                                    padding: '4rem 0 0 0'
                                }
                            }}>
                            {translate(
                                'text.WARNING_NO_EXAMPLE_DATA_SOURCE_SELECTED',
                                'No example data source selected. Select a data source or create a new one'
                            )}
                        </Text>
                    </Stack>
                )}
            </AddInContentWithItemList>

            {dataQuerySearchSourceDialogConfig?.show && (
                <DataQuerySourceDialog
                    actionType={dataQuerySearchSourceDialogConfig.actionType}
                    blockedNames={dataQuerySearchSourceDialogConfig.blockedNames}
                    config={dataQuerySearchSourceDialogConfig.config}
                    hidden={!dataQuerySearchSourceDialogConfig.show}
                    loginProfiles={loginProfiles}
                    onDismiss={handleSourceDialogDimiss}
                    onSubmit={handleSourceDialogSubmit}
                    sources={dataQuerySearchSourceDialogConfig.sources}
                />
            )}

            {sourceDeleteDialogConfig?.show && (
                <DataQuerySourceDeleteDialog
                    hidden={!sourceDeleteDialogConfig.show}
                    onDismiss={handleSourceDeleteDialogDismiss}
                    onSubmit={handleSourceDeleteDialogSubmit}
                    sources={sourceDeleteDialogConfig.sources}
                />
            )}

            {queryDeleteDialogConfig?.show && (
                <DataQueryDeleteDialog
                    hidden={!queryDeleteDialogConfig.show}
                    onDismiss={handleQueryDeleteDialogDismiss}
                    onSubmit={handleSourceQueryDeleteDialogSubmit}
                    queries={queryDeleteDialogConfig.queries}
                />
            )}

            {dataQuerySearchQueryPanelConfig?.show && (
                <DataQueryConfigPanel
                    blockedNames={dataQuerySearchQueryPanelConfig.blockedNames}
                    config={dataQuerySearchQueryPanelConfig.config}
                    contextMenuItems={contextMenuItems}
                    isOpen={dataQuerySearchQueryPanelConfig.show}
                    onDismiss={handleQueryPanelDismiss}
                    onDismissed={handleQueryPanelDismiss}
                    onSubmitQuery={handleQueryPanelSubmit}
                    onTest={handleTestQuery}
                    panelType={dataQuerySearchQueryPanelConfig.panelType}
                    queryFields={EXAMPLE_QUERY_FIELDS}
                    type={PanelType.large}
                />
            )}
        </AddInContentLayout>
    );
};

