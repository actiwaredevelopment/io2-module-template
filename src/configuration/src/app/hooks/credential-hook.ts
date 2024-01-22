import { IDropdownOption } from '@fluentui/react';
import { IHttpCredential } from '@actiwaredevelopment/io-sdk-typescript-models';
import { useMemo } from 'react';

/**
 * Custom hook to generate a dropdown list of `IHttpCredential` login profiles
 *
 * @param loginProfiles The list of available login profiles
 * @param key A selection of properties which can be used as a key
 * @param withEmptyOption `optional` Empty option to allow a user to "unselect"
 *        a login profile
 *
 * @returns A list of dropdown items
 */
export function useHttpLoginProfileOptions(
    loginProfiles: IHttpCredential[],
    key: keyof Pick<IHttpCredential, 'id' | 'name'> = 'id',
    withEmptyOption = false
): IDropdownOption[] {
    return useMemo<ReturnType<typeof useHttpLoginProfileOptions>>(() => {
        const options = loginProfiles.flatMap<IDropdownOption<IHttpCredential>>((profile) =>
            profile[key]
                ? [
                      {
                          data: profile,
                          key: profile[key] ?? '',
                          text: profile.name ?? profile.id ?? ''
                      }
                  ]
                : []
        );

        if (withEmptyOption) {
            options.unshift({
                key: '',
                text: ''
            });
        }

        return options;
    }, [key, loginProfiles, withEmptyOption]);
}

