import { layoutUtils, FieldMappingSettings, IFieldMappingField } from '@actiwaredevelopment/io-sdk-react';
import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';
import {
    IFieldConfig,
    IFieldContainer,
    IResultTable,
    ISyntaxFieldCategory
} from '@actiwaredevelopment/io-sdk-typescript-models';
import {
    DefaultButton,
    IPanelProps,
    IPanelStyles,
    IPivotStyleProps,
    IPivotStyles,
    IStyleFunctionOrObject,
    mergeStyles,
    Panel,
    PanelType,
    Pivot,
    PivotItem,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { DataQueryCommonSettings, DataQueryStatement } from '../components';
import { IDataQueryExampleQuery } from '../models';
import { useDataQueryContextMenuItems } from '../hooks';
import { DataQueryErrorType, validateDataQueryConfig, validateFieldMapping } from '../validation';
import { VALIDATION_TIMEOUT } from '../../../models';

const PIVOT_STYLES: IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles> = {
    root: layoutUtils.PIVOT_ROOT_STYLES,
    itemContainer: layoutUtils.PIVOT_ITEM_CONTAINER_STYLES
};

interface IDataQueryConfigPanelProps extends IPanelProps {
    blockedNames: string[];
    config: IDataQueryExampleQuery;
    contextMenuItems: ISyntaxFieldCategory[];
    panelType: EditPanelType;
    queryFields: string[];

    onSubmitQuery: (config: IDataQueryExampleQuery, index?: number) => void;
    onTest: (
        config?: IDataQueryExampleQuery,
        ignoreMapping?: boolean,
        callback?: (status: boolean, reason?: string, result?: IResultTable) => void
    ) => void;
}

export type EditPanelType = 'DUPLICATE' | 'NEW' | 'OPEN';

export interface IDataQueryConfigPanelConfig {
    blockedNames: string[];
    config: IDataQueryExampleQuery;
    panelType: EditPanelType;
    show: boolean;
}

export const DataQueryConfigPanel: React.FunctionComponent<IDataQueryConfigPanelProps> = (props) => {
    const { t: translate } = useTranslation();

    const [config, setConfig] = useState<IDataQueryExampleQuery>(props.config);
    const [configErrors, setConfigErrors] = useState<DataQueryErrorType>({});
    const [queryFields, setQueryFields] = useState<string[]>(props.queryFields ?? []);

    const contextMenuItems = useDataQueryContextMenuItems(queryFields, props.contextMenuItems);

    const timeoutIdRef = useRef<NodeJS.Timeout>();

    const isValid = Object.keys(configErrors).length === 0;
    const fieldMapping: IFieldMappingField[] = (config.field_mappings ?? []).map((fieldMapping) => ({
        id: fieldMapping.id ?? uuidv4(),
        name: fieldMapping.name ?? '',
        mapping: fieldMapping.value ?? '',
        errorMessage: validateFieldMapping(fieldMapping, translate)
    }));

    useEffect(() => {
        clearTimeout(timeoutIdRef.current);

        // We delay the validation to prevent unnecessary rerenders for each keystroke
        timeoutIdRef.current = setTimeout(() => {
            const errors = validateDataQueryConfig(config, props.blockedNames, translate);

            setConfigErrors(errors);
        }, VALIDATION_TIMEOUT);
    }, [props.blockedNames, config, translate]);

    function handleAutoMapFields(executeQuery?: boolean, callback?: (errorMessage?: string) => void) {
        if (!executeQuery) {
            callback?.();

            return;
        }

        props.onTest?.(config, true, (_status: boolean, reason?: string, result?: IResultTable) => {
            if (!result || result.is_failed) {
                callback?.(reason ?? translate('EXAMPLE_AUTO_MAP_FIELDS_FAILED', 'Error occured'));

                return;
            }

            if (!result.columns?.length) {
                callback?.(reason ?? translate('EXAMPLE_AUTO_MAP_FIELDS_NO_COLUMN', 'No colums found'));

                return;
            }

            const newItems = [...(config?.field_mappings ?? [])];

            for (const column of result.columns) {
                const index = newItems.findIndex((search) => search.name?.toLowerCase() === column.name?.toLowerCase());

                if (index < 0 && column.name) {
                    newItems.push({
                        id: uuidv4(),
                        name: column.name,
                        value: `[DBO.${column.name}]`
                    });
                }
            }

            const queryFields = newItems.flatMap((field) => (field.name ? [field.name] : []));

            setQueryFields(queryFields);
            setConfig((current) => ({
                ...current,
                field_mappings: newItems
            }));

            callback?.();
        });
    }

    function handleDefaultButtonClick() {
        handleDismiss();
    }

    function handleDismiss(event?: React.SyntheticEvent<HTMLElement, Event> | KeyboardEvent) {
        // Prevents the panel from closing when interacting outside the overlay.
        if (event instanceof MouseEvent) {
            return;
        }

        // Reset states

        props.onDismiss?.(event);
    }

    function handleFieldMappingChange(fieldMapping?: IFieldMappingField[]) {
        const fieldMappings = (fieldMapping ?? []).map<IFieldConfig>((field) => ({
            id: field.id,
            name: field.name,
            value: field.mapping
        }));

        setConfig((current) => ({
            ...current,
            field_mappings: fieldMappings
        }));
    }

    function handleLoadFields(executeQuery?: boolean, callback?: (errorMessage?: string) => void) {
        if (!executeQuery) {
            callback?.();

            return;
        }

        props.onTest?.(config, true, (_status: boolean, reason?: string, result?: IResultTable) => {
            if (!result || result.is_failed) {
                callback?.(reason ?? translate('EXAMPLE_AUTO_MAP_FIELDS_FAILED', 'Error occured'));

                return;
            }

            if (!result.columns?.length) {
                callback?.(reason ?? translate('EXAMPLE_AUTO_MAP_FIELDS_NO_COLUMN', 'No colums found'));

                return;
            }

            const newItems = [...(config?.field_mappings ?? [])];

            for (const column of result.columns) {
                const index = newItems.findIndex((search) => search.name?.toLowerCase() === column.name?.toLowerCase());

                if (index < 0 && column.name) {
                    newItems.push({
                        id: uuidv4(),
                        name: column.name,
                        value: `[DBO.${column.name}]`
                    });
                }
            }

            const queryFields = newItems.flatMap((field) => (field.name ? [field.name] : []));

            setQueryFields(queryFields);
            setConfig((current) => ({
                ...current,
                field_mappings: newItems
            }));

            callback?.();
        });
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

    function handlePrimaryButtonClick() {
        props.onSubmitQuery(config);
    }

    function handleRenderFooterContent(): JSX.Element {
        return (
            <Stack horizontal>
                <Stack
                    horizontal
                    tokens={{
                        childrenGap: '.5rem'
                    }}>
                    <PrimaryButton
                        text={translate('text.BUTTON_SAVE', 'Save')}
                        disabled={!isValid}
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

    function handleTest(query?: IDataQueryExampleQuery) {
        if (!query) {
            return;
        }

        props.onTest?.(query, true);
    }

    return (
        <Panel
            headerText={
                props.panelType === 'NEW'
                    ? translate('text.TITLE_NEW_SEARCH_QUERY_SETTINGS', 'Create new data query')
                    : translate('text.TITLE_MODIFY_SEARCH_QUERY_SETTINGS', 'Modify data query: {{name}}', {
                          name: config?.name ?? config?.id ?? ''
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
                    styles={PIVOT_STYLES}>
                    <PivotItem headerText={translate('text.TAB_ITEM_QUERY_SETTINGS', 'Query Settings')}>
                        <Stack
                            verticalFill
                            tokens={{
                                childrenGap: '1.25rem'
                            }}>
                            <DataQueryCommonSettings
                                config={config}
                                errors={configErrors}
                                onChange={setConfig}
                                onTest={handleTest}
                            />

                            <DataQueryStatement
                                config={config}
                                errors={configErrors}
                                onChange={setConfig}
                            />
                        </Stack>
                    </PivotItem>

                    <PivotItem headerText={translate('text.TAB_ITEM_FIELD_MAPPING', 'Field Mapping')}>
                        <FieldMappingSettings
                            allowSessionStorage={true}
                            contextMenuItems={contextMenuItems}
                            items={fieldMapping}
                            onAutoMapFields={handleAutoMapFields}
                            onChange={handleFieldMappingChange}
                            onLoadFields={handleLoadFields}
                            onOpenSyntax={handleOpenSyntax}
                            translator={translate}
                        />
                    </PivotItem>
                </Pivot>
            </Stack>
        </Panel>
    );
};
