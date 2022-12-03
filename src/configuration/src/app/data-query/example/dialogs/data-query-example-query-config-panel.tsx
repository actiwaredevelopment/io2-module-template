import { IDataQueryExampleQuery, IDataQueryExampleSource } from '../models';
import { IFieldContainer, IResultTable } from '@actiwaredevelopment/io-sdk-typescript-models';
import { ISystemInfoResponse } from '@actiwaredevelopment/io-sdk-typescript-designer';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    DefaultButton,
    IPanelProps,
    IPanelStyles,
    mergeStyles,
    Panel,
    PanelType,
    Pivot,
    PivotItem,
    PrimaryButton,
    Stack
} from '@fluentui/react';

import { layoutUtils, FieldMappingSettings, IFieldMappingField } from '@actiwaredevelopment/io-sdk-react';

import { DataQueryExampleQueryCommonSettings } from '../components/data-query-example-query-common-settings';

import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import { useDataQueryContextMenuItems } from '../hooks';

import { validateDataQueryConfig, validateFieldMapping } from '../validation';

import { DataQueryExampleQueryStatement } from '../components/data-query-example-query-statement';

import { v4 as uuidv4 } from 'uuid';

export interface IDataQueryExampleQueryConfigStatePanelConfig {
    show?: boolean;
    source?: IDataQueryExampleSource;
    config?: IDataQueryExampleQuery;

    systemInfo?: ISystemInfoResponse;

    blockedNames?: string[];
    queryFields?: string[];

    locked?: boolean;
    actionType?: 'NEW' | 'DUPLICATE' | 'OPEN';
}

interface IDataQueryExampleQueryConfigStatePanelProps
    extends IDataQueryExampleQueryConfigStatePanelConfig,
        IPanelProps {
    onTest?: (
        config?: IDataQueryExampleQuery,
        ignoreMapping?: boolean,
        callback?: (status: boolean, reason?: string, result?: IResultTable) => void
    ) => void;

    onSubmitAction?: (action: IDataQueryExampleQuery, index?: number) => void;
    onDeleteAction?: (action: IDataQueryExampleQuery, index?: number) => void;
}

export interface IDataQueryExampleQueryConfigSettingsProps {
    locked?: boolean;
    config?: IDataQueryExampleQuery;
    systemInfo?: ISystemInfoResponse;

    blockedNames?: string[];

    queryFields?: string[];

    errors?: Record<string, string>;

    onChange?: (config: IDataQueryExampleQuery) => void;
    onTest?: (config?: IDataQueryExampleQuery) => void;
}

export const DataQueryExampleQueryConfigStatePanel: React.FunctionComponent<
    IDataQueryExampleQueryConfigStatePanelProps
> = (props) => {
    const { t: translate } = useTranslation();

    const isDebug = location.search.toLowerCase().includes('debug');

    const [config, setConfig] = useState<IDataQueryExampleQuery>();
    const [isValid, setValidState] = useState<boolean>(false);

    const [errors, setErrors] = useState<Record<string, string>>();

    const [queryFields, setQueryFields] = useState<string[]>(props.queryFields ?? []);

    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const [fieldMapping, setFieldMapping] = useState<IFieldMappingField[]>([]);

    const contextMenuItems = useDataQueryContextMenuItems(queryFields, props.systemInfo);

    useEffect(() => {
        setConfig(props.config);
    }, [props.config]);

    useEffect(() => {
        if (!config?.field_mappings?.length) {
            setFieldMapping([]);

            return;
        }

        const fieldMapping: IFieldMappingField[] = config.field_mappings?.map((fieldMapping) => {
            return {
                id: fieldMapping.id ?? uuidv4(),
                name: fieldMapping.name ?? '',
                mapping: fieldMapping.value ?? '',
                errorMessage: validateFieldMapping(fieldMapping, translate)
            };
        });

        setFieldMapping(fieldMapping);
    }, [config?.field_mappings, translate]);

    useEffect(() => {
        if (!config) {
            setValidState(false);
        }

        const isValid = validateDataQueryConfig(config ?? {}, props.blockedNames, props.source, translate, (errors) => {
            setErrors(errors);
        });

        setValidState(isValid);
    }, [config, props.blockedNames, props.source, translate]);

    function handleChange(data: IDataQueryExampleQuery) {
        if (!data) {
            return;
        }

        setConfig(data);
    }

    function handleFieldMappingChange(fieldMapping?: IFieldMappingField[]) {
        setConfig({
            ...config,
            field_mappings:
                fieldMapping?.map((field) => {
                    return {
                        id: field.id,
                        field_name: field.name,
                        mapping_name: field.mapping
                    };
                }) ?? []
        });
    }

    function handleTest(query?: IDataQueryExampleQuery) {
        if (!query) {
            return;
        }

        if (!props.onTest || isDebug) {
            return;
        }

        props.onTest?.(query, true);
    }

    function handleOpenSyntax(currentValue: string, callback?: (newValue?: string) => void) {
        const fieldContainer: IFieldContainer = {};

        fieldContainer.special_fields = queryFields?.sort()?.map((field) => {
            return {
                prefix: 'DBO',
                name: field,
                value: `[DBO.${field}]`
            };
        });

        DesignerAPI.system.openSyntaxWizard(currentValue ?? '', fieldContainer, (newValue) => {
            callback?.(newValue);
        });
    }

    function handleLoadFields(executeQuery?: boolean, callback?: (errorMessage?: string) => void) {
        if (executeQuery === false) {
            callback?.();
        } else if (props.onTest && !isDebug) {
            props.onTest?.(props.config, true, (_status: boolean, reason?: string, result?: IResultTable) => {
                const newItems = [...(props.config?.field_mappings || [])];

                if (result === undefined) {
                    callback?.(reason ?? 'Error occurred');

                    return;
                }

                if (result && result.columns && result.columns.length > 0) {
                    result.columns.forEach((column) => {
                        if (
                            newItems.findIndex((search) => {
                                return search.name?.toLowerCase() === column.name?.toLowerCase();
                            }) < 0
                        ) {
                            newItems.push({
                                name: column.name ?? '',
                                value: `[DBO.${column.name ?? ''}]`
                            });
                        }
                    });

                    setQueryFields(
                        newItems.map((item) => {
                            return item.name ?? '';
                        })
                    );
                } else {
                    console.debug('No entries found');
                }

                callback?.();
            });
        } else {
            callback?.('In debug mode, query testing is disabled.');
        }
    }

    function handleAutoMapFields(executeQuery?: boolean, callback?: (errorMessage?: string) => void) {
        if (executeQuery === false) {
            callback?.();
        } else if (props.onTest && !isDebug) {
            props.onTest?.(props.config, true, (_status: boolean, reason?: string, result?: IResultTable) => {
                const newItems = [...(props.config?.field_mappings || [])];

                if (result === undefined) {
                    callback?.(reason ?? 'Error occurred');

                    return;
                }

                if (result && result.columns && result.columns.length > 0) {
                    result.columns.forEach((column) => {
                        if (
                            newItems.findIndex((search) => {
                                return search.name?.toLowerCase() === column.name?.toLowerCase();
                            }) < 0
                        ) {
                            newItems.push({
                                id: uuidv4(),
                                name: column.name ?? '',
                                value: `[DBO.${column.name ?? ''}]`
                            });
                        }
                    });

                    setQueryFields(
                        result.columns?.map((item) => {
                            return item.name ?? '';
                        })
                    );

                    setConfig({
                        ...props.config,
                        field_mappings: newItems
                    });
                } else {
                    console.debug('No entries found');
                }

                callback?.();
            });
        } else {
            callback?.('In debug mode, query testing is disabled.');
        }
    }

    async function handlePrimaryButtonClick() {
        if (!config) {
            return;
        }

        setIsUpdating(true);

        props.onSubmitAction?.(config);

        setIsUpdating(false);
    }

    function handleDefaultButtonClick() {
        handleDismiss();
    }

    function handleDismiss(event?: React.SyntheticEvent<HTMLElement, Event> | KeyboardEvent) {
        // Prevents the panel from closing when interacting outside the overlay.
        if (event instanceof MouseEvent) {
            return;
        }

        // Reset default values
        setConfig({});

        props.onDismiss?.(event);
    }

    function handleRenderFooterContent(): JSX.Element {
        if (props.locked === true) {
            return (
                <Stack horizontal>
                    <Stack
                        grow
                        horizontal
                        tokens={{
                            childrenGap: '.5rem'
                        }}>
                        <PrimaryButton
                            text={translate('text.BUTTON_CLOSE', 'Close')}
                            onClick={handleDefaultButtonClick}
                        />
                    </Stack>
                </Stack>
            );
        }

        return (
            <Stack horizontal>
                <Stack
                    grow
                    horizontal
                    tokens={{
                        childrenGap: '.5rem'
                    }}>
                    <PrimaryButton
                        text={translate('text.BUTTON_SAVE', 'Save')}
                        iconProps={{
                            iconName: isUpdating ? 'fa-spinner' : ''
                        }}
                        disabled={!isValid || isUpdating}
                        onClick={handlePrimaryButtonClick}
                    />

                    <DefaultButton
                        text={translate('text.BUTTON_CANCEL', 'Cancel')}
                        onClick={handleDefaultButtonClick}
                    />
                </Stack>
            </Stack>
        );
    }

    return (
        <Panel
            headerText={
                props.actionType === 'NEW'
                    ? translate('text.TITLE_NEW_SEARCH_QUERY_SETTINGS', 'Create new data query')
                    : translate('text.TITLE_MODIFY_SEARCH_QUERY_SETTINGS', 'Modify data query: {{name}}', {
                          name: props.config?.name ?? props.config?.id ?? ''
                      })
            }
            onRenderFooterContent={handleRenderFooterContent}
            type={PanelType.medium}
            isFooterAtBottom
            {...props}
            onDismiss={handleDismiss}
            styles={{
                ...props.styles,
                content: mergeStyles(
                    layoutUtils.PANEL_CONTENT_STYLE,
                    (props.styles as IPanelStyles | undefined)?.content
                ),
                scrollableContent: mergeStyles(
                    layoutUtils.PANEL_SCROLLABLE_STYLE,
                    (props.styles as IPanelStyles | undefined)?.scrollableContent
                )
            }}
            layerProps={{
                ...props.layerProps,
                eventBubblingEnabled: true
            }}>
            <Stack
                verticalFill
                tokens={{
                    childrenGap: '1.25rem'
                }}
                styles={{
                    root: {
                        padding: '0.5rem'
                    }
                }}>
                <Pivot
                    overflowBehavior='menu'
                    style={layoutUtils.PIVOT_BASE_STYLES}
                    styles={{
                        root: layoutUtils.PIVOT_ROOT_STYLES,
                        itemContainer: layoutUtils.PIVOT_ITEM_CONTAINER_STYLES
                    }}>
                    <PivotItem
                        headerText={translate('text.TAB_ITEM_QUERY_SETTINGS', 'Query Settings')}
                        // onRenderItemLink={(itemProps) =>
                        //     pivotUtils.renderPivotItem(
                        //         itemProps,
                        //         infoValidState.valid,
                        //         infoValidState.languageCode?.length
                        //             ? translate(`text.${infoValidState.languageCode}`, infoValidState.defaultText ?? '')
                        //             : ''
                        //     )
                        // }
                    >
                        <Stack
                            verticalFill
                            tokens={{
                                childrenGap: '1.25rem'
                            }}>
                            <DataQueryExampleQueryCommonSettings
                                config={config}
                                errors={errors}
                                systemInfo={props.systemInfo}
                                blockedNames={props.blockedNames}
                                queryFields={queryFields}
                                onChange={handleChange}
                                onTest={handleTest}
                            />

                            <DataQueryExampleQueryStatement
                                config={config}
                                errors={errors}
                                systemInfo={props.systemInfo}
                                blockedNames={props.blockedNames}
                                onChange={handleChange}
                            />
                        </Stack>
                    </PivotItem>
                    <PivotItem headerText={translate('text.TAB_ITEM_FIELD_MAPPING', 'Field Mapping')}>
                        <FieldMappingSettings
                            translator={translate}
                            items={fieldMapping ?? []}
                            contextMenuItems={contextMenuItems}
                            allowSessionStorage={true}
                            onOpenSyntax={handleOpenSyntax}
                            onAutoMapFields={handleAutoMapFields}
                            onLoadFields={handleLoadFields}
                            onChange={handleFieldMappingChange}
                        />
                    </PivotItem>
                </Pivot>
            </Stack>
        </Panel>
    );
};

