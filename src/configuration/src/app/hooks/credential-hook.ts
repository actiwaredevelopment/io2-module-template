import {
    ICredentialStoreItem,
    IHttpCredential,
} from "@actiwaredevelopment/io-sdk-typescript-models";
import { ISystemInfoResponse } from "@actiwaredevelopment/io-sdk-typescript-designer";

import { CREDENTIAL_STORE_CONFIG_KEY } from "../models/constants";

import { useMemo } from "react";

import { IDropdownOption } from "@fluentui/react";

export function useCredentials(
    systemInfo: ISystemInfoResponse
): IHttpCredential[] {
    const items = useMemo<ReturnType<typeof useCredentials>>(() => {
        const items: IHttpCredential[] = [];

        if (!systemInfo?.credentials?.length) {
            return items;
        }

        systemInfo?.credentials?.forEach((credential: ICredentialStoreItem) => {
            if (
                credential !== undefined &&
                credential.parameters !== undefined &&
                credential.parameters?.[CREDENTIAL_STORE_CONFIG_KEY] !==
                    undefined
            ) {
                try {
                    const loginProfile = JSON.parse(
                        credential?.parameters?.[CREDENTIAL_STORE_CONFIG_KEY] ??
                            ""
                    ) as IHttpCredential;

                    if (loginProfile) {
                        items.push(loginProfile);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });

        return items;
    }, [systemInfo]);

    return items;
}

export function useCredentialsAsOptions(
    systemInfo: ISystemInfoResponse,
    withEmptyOption = false
): IDropdownOption[] {
    const options = useMemo<ReturnType<typeof useCredentialsAsOptions>>(() => {
        const options: IDropdownOption[] = [];

        if (!systemInfo?.credentials?.length) {
            return options;
        }

        systemInfo?.credentials?.forEach((credential: ICredentialStoreItem) => {
            if (
                credential !== undefined &&
                credential.parameters !== undefined &&
                credential.parameters?.[CREDENTIAL_STORE_CONFIG_KEY] !==
                    undefined
            ) {
                try {
                    const loginProfile = JSON.parse(
                        credential?.parameters?.[CREDENTIAL_STORE_CONFIG_KEY] ??
                            ""
                    ) as IHttpCredential;

                    if (loginProfile) {
                        options.push({
                            key:
                                loginProfile.id ??
                                credential.id ??
                                loginProfile.name ??
                                "",
                            text:
                                loginProfile.name ??
                                loginProfile.id ??
                                credential.id ??
                                "",
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });

        if (withEmptyOption === true) {
            options.unshift({
                key: "",
                text: "",
            });
        }

        return options;
    }, [systemInfo, withEmptyOption]);

    return options;
}
