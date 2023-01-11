import { ICredentialStoreItem, IHttpCredential } from '@actiwaredevelopment/io-sdk-typescript-models';
import { CREDENTIAL_STORE_CONFIG_KEY } from '../models';

export function getCredentialData(credential?: ICredentialStoreItem): IHttpCredential | undefined {
    if (
        credential !== undefined &&
        credential.parameters !== undefined &&
        credential.parameters?.[CREDENTIAL_STORE_CONFIG_KEY] !== undefined
    ) {
        try {
            const loginProfile = JSON.parse(
                credential?.parameters?.[CREDENTIAL_STORE_CONFIG_KEY] ?? ''
            ) as IHttpCredential;

            return loginProfile;
        } catch (error) {
            console.error(error);
        }
    }
}
