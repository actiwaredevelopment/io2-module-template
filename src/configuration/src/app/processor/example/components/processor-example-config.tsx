import { FieldType, IItemConfig } from '@actiwaredevelopment/io-sdk-typescript-models';
import { ISystemInfoRequest, ISystemInfoResponse, SystemInfo } from '@actiwaredevelopment/io-sdk-typescript-designer';
import { CREDENTIAL_STORE_ID } from '../../../models';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import { Stack, ActionButton } from '@fluentui/react';
import { FullSpinner } from '@actiwaredevelopment/io-sdk-react';

import { IProcessorExampleConfig } from '../models';

import { credentialUtils } from '../../../utils';
import { convertFromItemConfig, convertToItemConfig, defaultConfig, upgradeConfig } from '../utils';

import { validateConfig } from '../validation';

import { ProcessorExampleCommonSettings } from './processor-example-common-settings';

const SYSTEM_INFO_REQUEST: ISystemInfoRequest = {
    mode: SystemInfo.ContextMenuItems | SystemInfo.Credentials,
    credential_store_filter: [CREDENTIAL_STORE_ID],
    context_menu_items:
        FieldType.Parameter | FieldType.DataField | FieldType.Variable | FieldType.NodeField | FieldType.Plugins
};

export interface IProcessorExampleConfigProps {
    config?: IProcessorExampleConfig;
    systemInfo?: ISystemInfoResponse;
    errors?: Record<string, string>;

    onChange?: (config: IProcessorExampleConfig) => void;
    onAddCredential?: () => void;
}

export const ProcessorExampleConfig: React.FunctionComponent = () => {
    const { t: translate } = useTranslation();

    const isDebug = location.search.toLowerCase().includes('debug');

    const [apiInitialized, setApiInitialized] = useState<boolean>(false);

    const [config, setConfig] = useState<IProcessorExampleConfig>(defaultConfig);

    const [systemInfo, setSystemInfo] = useState<ISystemInfoResponse | undefined>();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleLoad = useCallback(
        (configItem?: IItemConfig, systemInfo?: DesignerAPI.ISystemInfoResponse) => {
            const config: IProcessorExampleConfig | undefined = convertFromItemConfig(configItem ?? {});

            if (isDebug) {
                console.log({ config, configItem, systemInfo });
            }

            setConfig(upgradeConfig(config ?? {}));
            setSystemInfo(systemInfo);
        },
        [isDebug]
    );

    const handleSave = useCallback(
        (saveEvent?: DesignerAPI.ISaveEvent) => {
            const itemConfig = convertToItemConfig(config);

            if (isDebug) {
                console.log({ config, itemConfig });
                console.log(JSON.stringify(itemConfig));
            }

            saveEvent?.notifySuccess(itemConfig);
        },
        [config, isDebug]
    );

    const handleSystemInfoUpdate = useCallback(
        (updateEvent?: DesignerAPI.IUpdateEvent) => {
            const systemInfo = updateEvent?.result as DesignerAPI.ISystemInfoResponse;

            if (isDebug) {
                console.log({ systemInfo });
            }

            if (systemInfo) {
                setSystemInfo(systemInfo);
            }
        },
        [isDebug]
    );

    // Load Designer API and credential store config
    useEffect(() => {
        if (isDebug || apiInitialized) {
            return;
        }

        DesignerAPI.initialize(() => {
            DesignerAPI.processor.loadConfig(SYSTEM_INFO_REQUEST, handleLoad);

            setApiInitialized(true);
        });
    }, [apiInitialized, handleLoad, isDebug]);

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

    // Validate configuration
    useEffect(() => {
        const errors: Record<string, string> = {};

        if (config) {
            const isValid = validateConfig(config, translate, (validateErrors) => {
                setErrors(validateErrors ?? {});
            });

            if (apiInitialized && !isDebug) {
                DesignerAPI.processor.setValidityState(isValid);
            }

            return;
        }

        setErrors(errors);
    }, [apiInitialized, config, isDebug, translate]);

    function handleConfigChange(config?: IProcessorExampleConfig) {
        if (!config) {
            return;
        }

        setConfig(config);

        if (apiInitialized && !isDebug) {
            // Send config changes directly to the designer
            DesignerAPI.processor.setConfigState(convertToItemConfig(config));
        }
    }

    function handleAddCredential() {
        if (!apiInitialized) {
            return;
        }

        DesignerAPI.system.openCredentialWizard([CREDENTIAL_STORE_ID], (newCredentials) => {
            if (!newCredentials?.length) {
                return;
            }

            const newCredential = credentialUtils.getCredentialData(newCredentials[0]);

            if (!newCredential) {
                return;
            }

            setConfig({
                ...config,
                login_profile: newCredential.id
            });
        });
    }

    if (apiInitialized === false && !isDebug) {
        return <FullSpinner />;
    }

    return (
        <Fragment>
            <Stack
                verticalFill
                styles={{
                    root: {
                        overflow: 'auto'
                    }
                }}>
                {isDebug && (
                    <ActionButton
                        iconProps={{
                            iconName: 'Print'
                        }}
                        onClick={() => {
                            handleSave();
                        }}>
                        Print config to console output
                    </ActionButton>
                )}

                <ProcessorExampleCommonSettings
                    config={config}
                    errors={errors}
                    systemInfo={systemInfo}
                    onChange={handleConfigChange}
                    onAddCredential={handleAddCredential}
                />
            </Stack>
        </Fragment>
    );
};

