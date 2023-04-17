import { copyAndSort } from '@actiwaredevelopment/io-sdk-react';
import { ICredentialStoreItem, IHttpCredential } from '@actiwaredevelopment/io-sdk-typescript-models';

import { CREDENTIAL_STORE_CONFIG_KEY } from '../models';

/**
 * Parse `IHttpCredential` from a given list of `ICredentialStoreItem`s.
 *
 * @param credentialItems The list of items which contains a serialized configuration
 *
 * @returns A list of parsed configurations. Configurations, which cause exceptions, are
 *          not included
 */
export function parseHttpCredentials(credentialItems: ICredentialStoreItem[]): IHttpCredential[] {
    const loginProfiles: IHttpCredential[] = [];

    for (const credential of credentialItems) {
        if (!credential.parameters?.[CREDENTIAL_STORE_CONFIG_KEY]) {
            continue;
        }

        let loginProfile: IHttpCredential | undefined;

        try {
            loginProfile = JSON.parse(credential.parameters[CREDENTIAL_STORE_CONFIG_KEY]);
        } catch {
            console.error('Error while parsing login profile');
        }

        if (!loginProfile) {
            continue;
        }

        loginProfiles.push(loginProfile);
    }

    return copyAndSort(loginProfiles, 'name', false);
}
