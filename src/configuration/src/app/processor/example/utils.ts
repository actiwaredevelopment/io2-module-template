import { CONFIG_KEY, IProcessorExampleConfig } from "./models";
import { IItemConfig } from "@actiwaredevelopment/io-sdk-typescript-models";

export const defaultConfig: IProcessorExampleConfig = {
    login_profile: '',
};

export function upgradeConfig(
    config: IProcessorExampleConfig
): IProcessorExampleConfig {
    if (config === undefined) {
        config = {};
    }

    return config;
}

export function convertToItemConfig(
    config: IProcessorExampleConfig
): IItemConfig {
    const itemConfig: IItemConfig = {};

    const nodeFields = ['MyField1', 'MyField2'];

    // Note: Use automatic formatting and set the individual values as alternate
    (itemConfig.parameters ??= {})[CONFIG_KEY] = JSON.stringify(config);

    // Note: Use automatic formatting and set the individual values as alternate
    (itemConfig.parameters ??= {}).login_profile = config.login_profile ?? '';

    // Fields returned by the processor    
    (itemConfig.parameters ??= {})['project.useditems'] = JSON.stringify(nodeFields);

    return itemConfig;
}

export function convertFromItemConfig(itemConfig?: IItemConfig): IProcessorExampleConfig {
    if (!itemConfig?.parameters) {
        return defaultConfig;
    }

    if (itemConfig?.parameters?.[CONFIG_KEY]?.length) {
        try {
            return JSON.parse(itemConfig?.parameters[CONFIG_KEY]);
        } catch (error) {
            console.error(error);

            return defaultConfig;
        }
    }

    return {
        login_profile: itemConfig?.parameters?.login_profile ?? '',
    };
}