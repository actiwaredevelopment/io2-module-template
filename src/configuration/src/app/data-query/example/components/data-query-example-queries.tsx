import { IDataQueryExampleQuery } from '../models';
import { IDataQueryExampleConfigProps } from './data-query-example-config';

import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Stack,
    Text,
    ContextualMenu,
    DetailsListLayoutMode,
    DirectionalHint,
    IColumn,
    IObjectWithKey,
    Link,
    MarqueeSelection,
    Selection,
    SelectionMode,
    ShimmeredDetailsList,
    TooltipHost,
    TooltipOverflowMode
} from '@fluentui/react';
import { copyAndSort, detailsListUtils, ISorting, IContextMenuOptions } from '@actiwaredevelopment/io-sdk-react';

export const DataQueryExampleQueries: React.FunctionComponent<IDataQueryExampleConfigProps> = (props) => {
    const { t: translate } = useTranslation();

    const [sorting, setSorting] = useState<ISorting<IDataQueryExampleQuery>>({
        fieldName: 'name',
        asc: true
    });
    const sortedProfiles = copyAndSort(props.selectedSource?.queries ?? [], sorting.fieldName, !sorting.asc);

    const selection = useRef(
        new Selection<IDataQueryExampleQuery & IObjectWithKey>({
            getKey: _getKey,
            onSelectionChanged: () => {
                const ids = selection.current.getSelection().map((element) => {
                    return element.id || '';
                });

                props.onChangeDataQuerySelection?.(ids ?? []);
            }
        })
    );

    const contextMenuRef = useRef(null);
    const [contextMenuOptions, setContextMenuOptions] = useState<IContextMenuOptions>({
        x: 0,
        y: 0,
        show: false
    });

    const columns: IColumn[] = [
        {
            key: 'name',
            name: translate('text.COLUMN_NAME', 'Name'),
            minWidth: 184,
            maxWidth: 280,
            isRowHeader: true,
            isResizable: true,
            isSorted: sorting.fieldName === 'name',
            isSortedDescending: !sorting.asc,
            fieldName: 'name',
            onRender: renderNameColumnWithMenu
        },
        {
            key: 'description',
            name: translate('text.COLUMN_DESCRIPTION', 'Description'),
            minWidth: 184,
            maxWidth: 280,
            isResizable: true,
            isSorted: sorting.fieldName === 'description',
            isSortedDescending: !sorting.asc,
            fieldName: 'description',
            onRender: detailsListUtils.renderTextColumn
        }
    ];

    function renderNameColumnWithMenu(item?: IDataQueryExampleQuery): JSX.Element | null {
        if (!item?.id) {
            return null;
        }

        return (
            <detailsListUtils.DetailsActionCell contextualMenuItems={props.selectionCommands ?? []}>
                <TooltipHost
                    content={item.name}
                    overflowMode={TooltipOverflowMode.Parent}>
                    <Link
                        style={{
                            userSelect: 'none'
                        }}
                        onClick={() => props.onOpen?.()}>
                        {item.name || ''}
                    </Link>
                </TooltipHost>
            </detailsListUtils.DetailsActionCell>
        );
    }

    function handleItemContextMenu(_?: IDataQueryExampleQuery, __?: number, event?: Event) {
        if (!event || !props.selectionCommands?.length) {
            return;
        }

        setContextMenuOptions({
            x: (event as PointerEvent).clientX,
            y: (event as PointerEvent).clientY,
            show: true
        });
    }

    function handleContextMenuDismiss() {
        setContextMenuOptions({
            x: 0,
            y: 0,
            show: false
        });
    }

    if (!sortedProfiles?.length) {
        return (
            <Stack
                verticalAlign='center'
                style={{
                    paddingTop: '3.125rem',
                    opacity: '0.5'
                }}>
                <Text
                    variant='large'
                    style={{
                        textAlign: 'center',
                        userSelect: 'none'
                    }}>
                    {translate(
                        'text.WARNING_NO_DATA_QUERIES',
                        'No data queries were found or configured. Start the configuration by adding a new data query'
                    )}
                </Text>
            </Stack>
        );
    }

    return (
        <Fragment>
            <MarqueeSelection selection={selection.current}>
                <ShimmeredDetailsList
                    items={sortedProfiles}
                    columns={columns}
                    selection={selection.current}
                    selectionMode={SelectionMode.multiple}
                    onShouldVirtualize={() => false}
                    getKey={_getKey}
                    setKey='id'
                    layoutMode={DetailsListLayoutMode.justified}
                    onColumnHeaderClick={(ev, column) =>
                        detailsListUtils.handleColumnHeaderClick(ev, column, setSorting)
                    }
                    onItemContextMenu={handleItemContextMenu}
                    onRenderRow={detailsListUtils.renderActionsRow}
                    detailsListStyles={{
                        root: {
                            overflow: 'unset'
                        },
                        headerWrapper: {
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000
                        }
                    }}
                />
            </MarqueeSelection>

            <ContextualMenu
                items={props.selectionCommands ?? []}
                hidden={!contextMenuOptions.show}
                target={contextMenuRef}
                onDismiss={handleContextMenuDismiss}
                directionalHint={DirectionalHint.bottomLeftEdge}
            />

            <div
                ref={contextMenuRef}
                style={{
                    position: 'fixed',
                    left: contextMenuOptions.x,
                    top: contextMenuOptions.y
                }}></div>
        </Fragment>
    );
};

function _getKey(item?: IDataQueryExampleQuery, index?: number): string {
    return `${item?.id} ?? ${index}`;
}

