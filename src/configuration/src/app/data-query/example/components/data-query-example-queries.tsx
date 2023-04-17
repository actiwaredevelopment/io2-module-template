import { copyAndSort, detailsListUtils, ISorting, IContextMenuOptions } from '@actiwaredevelopment/io-sdk-react';
import {
    ContextualMenu,
    DetailsList,
    DetailsListLayoutMode,
    DirectionalHint,
    IColumn,
    ICommandBarItemProps,
    IObjectWithKey,
    Link,
    MarqueeSelection,
    Selection,
    SelectionMode,
    Stack,
    Text,
    TooltipHost,
    TooltipOverflowMode,
    useTheme
} from '@fluentui/react';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IDataQueryExampleQuery } from '../models';

interface IDataQueryQueriesProps {
    queries: IDataQueryExampleQuery[];
    selectionCommands: ICommandBarItemProps[];

    onChangeDataQuerySelection: (ids: string[]) => void;
    onEdit: () => void;
}

export const DataQueryQueries: React.FunctionComponent<IDataQueryQueriesProps> = (props) => {
    const theme = useTheme();
    const { t: translate } = useTranslation();

    const [contextMenuOptions, setContextMenuOptions] = useState<IContextMenuOptions>({
        x: 0,
        y: 0,
        show: false
    });
    const [sorting, setSorting] = useState<ISorting<IDataQueryExampleQuery>>({
        fieldName: 'name',
        asc: true
    });

    const contextMenuRef = useRef(null);
    const selection = useRef(
        new Selection<IDataQueryExampleQuery & IObjectWithKey>({
            getKey: getkey,
            onSelectionChanged: () => {
                const ids = selection.current.getSelection().flatMap((query) => (query.id ? [query.id] : []));

                props.onChangeDataQuerySelection(ids);
            }
        })
    );

    const sortedQueries = copyAndSort(props.queries, sorting.fieldName, !sorting.asc);

    const columns: IColumn[] = [
        {
            fieldName: 'name',
            isResizable: true,
            isRowHeader: true,
            isSorted: sorting.fieldName === 'name',
            isSortedDescending: !sorting.asc,
            key: 'name',
            maxWidth: 280,
            minWidth: 184,
            name: translate('text.COLUMN_NAME', 'Name'),
            onRender: handleNameColumnRender
        },
        {
            fieldName: 'description',
            isResizable: true,
            isSorted: sorting.fieldName === 'description',
            isSortedDescending: !sorting.asc,
            key: 'description',
            minWidth: 184,
            name: translate('text.COLUMN_DESCRIPTION', 'Description'),
            onRender: detailsListUtils.renderTextColumn
        }
    ];

    function handleNameColumnRender(query?: IDataQueryExampleQuery): JSX.Element | null {
        if (!query?.name) {
            return null;
        }

        return (
            <detailsListUtils.DetailsActionCell contextualMenuItems={props.selectionCommands}>
                <TooltipHost
                    content={query.name}
                    overflowMode={TooltipOverflowMode.Parent}>
                    <Link onClick={props.onEdit}>{query.name}</Link>
                </TooltipHost>
            </detailsListUtils.DetailsActionCell>
        );
    }

    function handleItemContextMenu(_?: IDataQueryExampleQuery, __?: number, event?: Event) {
        if (!event || !props.selectionCommands) {
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

    if (!sortedQueries.length) {
        return (
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
                <DetailsList
                    columns={columns}
                    getKey={getkey}
                    items={sortedQueries}
                    layoutMode={DetailsListLayoutMode.justified}
                    onItemContextMenu={handleItemContextMenu}
                    onRenderRow={detailsListUtils.renderActionsRow}
                    selection={selection.current}
                    selectionMode={SelectionMode.multiple}
                    setKey='id'
                    onColumnHeaderClick={(ev, column) =>
                        detailsListUtils.handleColumnHeaderClick(ev, column, setSorting)
                    }
                    styles={{
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
                directionalHint={DirectionalHint.bottomLeftEdge}
                hidden={!contextMenuOptions.show}
                items={props.selectionCommands}
                onDismiss={handleContextMenuDismiss}
                target={contextMenuRef}
            />

            <div
                ref={contextMenuRef}
                style={{
                    position: 'fixed',
                    left: contextMenuOptions.x,
                    top: contextMenuOptions.y
                }}
            />
        </Fragment>
    );
};

function getkey(item?: IDataQueryExampleQuery, index?: number): string {
    return item?.id || (index ?? 0).toString();
}
