import { IDataQueryExampleConfig } from './models/data-query-example-config';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { INavLink, INavLinkGroup, IDropdownOption } from '@fluentui/react';
import { copyAndSort } from '@actiwaredevelopment/io-sdk-react';

import { ISystemInfoResponse } from '@actiwaredevelopment/io-sdk-typescript-designer';
import { ISyntaxFieldCategory } from '@actiwaredevelopment/io-sdk-typescript-models';

export function useDataQuerySourceNav(config?: IDataQueryExampleConfig): INavLinkGroup[] | undefined {
    const navLinks = useMemo<INavLink[] | undefined>(() => {
        if (!config?.sources?.length) {
            return undefined;
        }

        return copyAndSort(config?.sources ?? [], 'name', false)?.map<INavLink>((dataSource) => {
            return {
                key: dataSource.id ?? '',
                title: dataSource.name || dataSource.id || '',
                name: dataSource.name || dataSource.id || '',
                url: `.source?itemId=${dataSource.id}`,
                data: dataSource
            };
        });
    }, [config]);

    if (navLinks === undefined) {
        return undefined;
    }

    return [
        {
            links: navLinks?.filter((link) => link !== undefined) ?? []
        }
    ];
}

export function useSolrFieldsAsOptions(items?: string[]): IDropdownOption[] {
    const options = useMemo<ReturnType<typeof useSolrFieldsAsOptions>>(() => {
        const options: IDropdownOption[] = [];

        if (!items?.length) {
            return options;
        }

        items.forEach((item) => {
            options.push({
                key: item ?? '',
                text: item ?? ''
            });
        });

        return options;
    }, [items]);

    return options;
}

export function useDataQueryContextMenuItems(
    fields?: string[],
    systemInfo?: ISystemInfoResponse
): ISyntaxFieldCategory[] {
    const { t: translate } = useTranslation();

    const contextMenuItems = useMemo<ReturnType<typeof useDataQueryContextMenuItems>>(() => {
        const menuItems: ISyntaxFieldCategory[] = [...(systemInfo?.context_menus ?? [])];

        if (fields?.length) {
            const fieldMappingMenu: ISyntaxFieldCategory = {
                prefix: 'DBO',
                name: translate('text.MENU_ITEM_RESULT_FIELDS', 'Result Fields'),
                fields: []
            };

            fields?.sort().forEach((field) => {
                if (field.length) {
                    if (!fieldMappingMenu.fields?.some((search) => search.toLowerCase() === field.toLowerCase())) {
                        fieldMappingMenu.fields?.push(field ?? '');
                    }
                }
            });

            menuItems.push(fieldMappingMenu);
        }

        return menuItems;
    }, [fields, systemInfo?.context_menus, translate]);

    return contextMenuItems;
}

