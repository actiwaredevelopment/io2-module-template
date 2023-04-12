import { copyAndSort } from '@actiwaredevelopment/io-sdk-react';
import { ISyntaxFieldCategory } from '@actiwaredevelopment/io-sdk-typescript-models';
import { INavLink, INavLinkGroup } from '@fluentui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IDataQueryExampleSource } from './models';

/**
 * Custom hook to create dropdown items for existing data query fields.
 *
 * @param fields The fields from the given data query.
 * @param syntaxCategories Existing context menu items which are loaded beforehand.
 *
 * @returns A list which contains the existing context menu items and the data query field items.
 */
export function useDataQueryContextMenuItems(
    fields: string[],
    syntaxCategories: ISyntaxFieldCategory[]
): ISyntaxFieldCategory[] {
    const { t: translate } = useTranslation();

    const contextMenuItems = useMemo<ReturnType<typeof useDataQueryContextMenuItems>>(() => {
        const menuItems: ISyntaxFieldCategory[] = [...syntaxCategories];
        const resultFields: string[] = [];
        const fieldMappingMenu: ISyntaxFieldCategory = {
            prefix: 'DBO',
            name: translate('text.MENU_ITEM_RESULT_FIELDS', 'Result Fields'),
            fields: resultFields
        };

        // Remove empty strings
        const sortedFields = fields.filter((field) => field).sort();

        for (const field of sortedFields) {
            const exists = resultFields.some((search) => search.toLowerCase() === field.toLowerCase());

            if (!exists) {
                resultFields.push(field);
            }
        }

        if (fieldMappingMenu.fields?.length) {
            menuItems.push(fieldMappingMenu);
        }

        return menuItems;
    }, [fields, syntaxCategories, translate]);

    return contextMenuItems;
}

/**
 * Custom Hook to generate NavLink items.
 *
 * @param sources A list of data query sources.
 *
 * @returns A list of NavLink items which can be used to open the configuration.
 */
export function useDataQuerySourceNav(sources: IDataQueryExampleSource[]): INavLinkGroup[] {
    return useMemo<INavLinkGroup[]>(() => {
        const navLinks = copyAndSort(sources, 'name', false).flatMap<INavLink>((source) =>
            source.id
                ? [
                      {
                          key: source.id,
                          title: source.name || source.id,
                          name: source.name || source.id,
                          url: `.source?itemId=${source.id}`,
                          data: source
                      }
                  ]
                : []
        );

        return [
            {
                links: navLinks
            }
        ];
    }, [sources]);
}
