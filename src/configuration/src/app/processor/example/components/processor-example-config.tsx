import { FullSpinner } from '@actiwaredevelopment/io-sdk-react';
import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';
import {
    FieldType,
    IHttpCredential,
    IItemConfig,
    ISyntaxFieldCategory,
    ReportLevel
} from '@actiwaredevelopment/io-sdk-typescript-models';
import { Stack } from '@fluentui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HTTP_CREDENTIAL_STORE_ID, VALIDATION_TIMEOUT } from '../../../models';
import { credentialUtils } from '../../../utils';
import { convertItemConfigToConfig, convertToItemConfig, getDefaultProcessorConfig, upgradeConfig } from '../config';
import { IProcessorExampleConfig } from '../models';
import { ConfigErrorType, validateConfig } from '../validation';
import { ProcessorCommonSettings } from './processor-example-common-settings';

const SYSTEM_INFO_REQUEST: DesignerAPI.ISystemInfoRequest = {
    mode: DesignerAPI.SystemInfo.ContextMenuItems | DesignerAPI.SystemInfo.Credentials,
    credential_store_filter: [HTTP_CREDENTIAL_STORE_ID],
    context_menu_items:
        FieldType.Parameter | FieldType.DataField | FieldType.Variable | FieldType.NodeField | FieldType.Plugins
};

export interface IProcessorExampleConfigProps {
    config: IProcessorExampleConfig;
    contextMenuItems: ISyntaxFieldCategory[];
    errors: ConfigErrorType;
    readOnly: boolean;
    loginProfiles: IHttpCredential[];

    onChange: (config: IProcessorExampleConfig) => void;
    onAddCredential: () => void;
}

export const ProcessorConfig: React.FunctionComponent = () => {
    const { t: translate } = useTranslation();

    const [apiInitialized, setApiInitialized] = useState<boolean>(false);
    const [config, setConfig] = useState<IProcessorExampleConfig>(() => getDefaultProcessorConfig());
    const [contextMenuItems, setContextMenuItems] = useState<ISyntaxFieldCategory[]>([]);
    const [errors, setErrors] = useState<ConfigErrorType>({});
    const [loginProfiles, setLoginProfiles] = useState<IHttpCredential[]>([]);
    const [locked, setLockState] = useState<boolean>(false);

    const timeoutIdRef = useRef<NodeJS.Timeout>();

    const handleLoad = useCallback((itemConfig?: IItemConfig, systemInfo?: DesignerAPI.ISystemInfoResponse) => {
        const config: IProcessorExampleConfig = convertItemConfigToConfig(itemConfig);

        const upgradedConfig = upgradeConfig(config);
        const contextMenuItems = systemInfo?.context_menus ?? [];
        const httpLoginProfiles = credentialUtils.parseHttpCredentials(systemInfo?.credentials ?? []);

        console.log(systemInfo);

        setApiInitialized(true);
        setConfig(upgradedConfig);
        setContextMenuItems(contextMenuItems);
        setLoginProfiles(httpLoginProfiles);
        setLockState(systemInfo?.locked === true);
    }, []);

    const handleSave = useCallback(
        (saveEvent?: DesignerAPI.ISaveEvent) => {
            let itemConfig: IItemConfig | undefined;

            try {
                itemConfig = convertToItemConfig(config);
            } catch {
                console.error('Error while serializing configuration');
            }

            // If we do not have an ItemConfig at this point, the serialization must have failed.
            // We can display the error in the IO Web Designer.
            if (!itemConfig) {
                DesignerAPI.system.sendNotification({
                    errorCode: 'CONFIG_SERIALIZATION_ERROR',
                    level: ReportLevel.Error,
                    text: translate(
                        'text.ITEM_CONFIG_NOT_PRESENT',
                        'Config could not be created. Serialization failed.'
                    ),
                    title: translate('text.SERIALIZATION_ERROR', 'Serialization Error')
                });

                return;
            }

            saveEvent?.notifySuccess(itemConfig);
        },
        [config, translate]
    );

    const handleSystemInfoUpdate = useCallback((updateEvent?: DesignerAPI.IUpdateEvent) => {
        if (!updateEvent?.result) {
            return;
        }

        const systemInfo = updateEvent?.result as DesignerAPI.ISystemInfoResponse;

        if (systemInfo.mode === DesignerAPI.SystemInfo.Credentials) {
            const httpLoginProfiles = credentialUtils.parseHttpCredentials(systemInfo?.credentials ?? []);

            setLoginProfiles(httpLoginProfiles);
        }

        if (systemInfo.mode === DesignerAPI.SystemInfo.ContextMenuItems) {
            setContextMenuItems(systemInfo.context_menus ?? []);
        }
    }, []);

    // Load Designer API and credential store config
    useEffect(() => {
        if (apiInitialized) {
            return;
        }

        DesignerAPI.initialize(() => DesignerAPI.processor.loadConfig(SYSTEM_INFO_REQUEST, handleLoad));
    }, [apiInitialized, handleLoad]);

    // Update save handler
    useEffect(() => {
        if (!apiInitialized) {
            return;
        }

        DesignerAPI.processor.registerOnSaveHandler(handleSave);
    }, [apiInitialized, handleSave]);

    // Update system info update handler
    useEffect(() => {
        if (!apiInitialized) {
            return;
        }

        DesignerAPI.system.registerOnUpdateHandler(handleSystemInfoUpdate);
    }, [apiInitialized, handleSystemInfoUpdate]);

    // Validate configuration with a delay to prevent unnecessary rerender
    useEffect(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        timeoutIdRef.current = setTimeout(() => {
            const errors = validateConfig(config, translate);
            const isValid = Object.keys(errors).length === 0;

            DesignerAPI.processor.setValidityState(isValid);

            setErrors(errors);
        }, VALIDATION_TIMEOUT);
    }, [config, translate]);

    function handleAddCredential() {
        DesignerAPI.system.openCredentialWizard([HTTP_CREDENTIAL_STORE_ID], (newCredentials) => {
            if (!newCredentials?.length) {
                return;
            }

            const newCredential = credentialUtils.parseHttpCredentials(newCredentials);

            if (!newCredential[0]) {
                return;
            }

            setConfig((current) => ({
                ...current,
                login_profile: newCredential[0].id
            }));
        });
    }

    if (!apiInitialized) {
        return <FullSpinner />;
    }

    return (
        <Stack
            verticalFill
            tokens={{
                childrenGap: '0.5rem'
            }}>
            <ProcessorCommonSettings
                config={config}
                contextMenuItems={contextMenuItems}
                errors={errors}
                readOnly={locked}
                loginProfiles={loginProfiles}
                onAddCredential={handleAddCredential}
                onChange={setConfig}
            />

            {/* Place additional configuration elements here. */}
        </Stack>
    );
};

