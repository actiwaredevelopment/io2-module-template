import { NODE_FIELD_PARAMETER } from '../../models';
import { IProcessorExampleConfig } from './models';
import { IItemConfig } from '@actiwaredevelopment/io-sdk-typescript-models';

/**
 * Function to create a default configuration. Can be used if no configuration is present
 * or a new configuration should be created.
 *
 * @returns A new default configuration
 */
export function getDefaultProcessorConfig(): IProcessorExampleConfig {
    return {
        login_profile: ''
    };
}

/**
 * Used to given IDs to parts of the configuration. These IDs are used in React, e.g.
 * in lists.
 *
 * @param config The basic configuration.
 *
 * @returns A new configuration object which contains IDs for items that are stored in lists.
 */
export function upgradeConfig(config: IProcessorExampleConfig): IProcessorExampleConfig {
    // Provide configuration with IDs if required. Could be useful for elements, which are
    // rendered in a list. If there are no IDs required, this function can be removed
    return config;
}

/**
 * Convert the given configuration to an `ItemConfig`. This will convert the
 * given processor configuration to a JSON string.
 *
 * @param config The configuration which will be serialized.
 *
 * @throws An exception if the configuration could not be stringified
 *
 * @returns An `IItemConfig` which contains the serialized configuration
 */
export function convertItemConfigToConfig(config?: IItemConfig): IProcessorExampleConfig {
    if (!config?.parameters || !Object.keys(config.parameters).length) {
        return getDefaultProcessorConfig();
    }

    return {
        login_profile: config.parameters?.['login_profile'] ?? ''
    };
}

/**
 * Convert the given configuration to an `ItemConfig`. This will convert the
 * given processor configuration to a JSON string.
 *
 * @param config The configuration which will be serialized.
 *
 * @throws An exception if the configuration could not be stringified
 *
 * @returns An `IItemConfig` which contains the serialized configuration
 */
export function convertToItemConfig(config: IProcessorExampleConfig): IItemConfig {
    const nodeFields = [''];

    const itemConfig: IItemConfig = {
        parameters: {
            [NODE_FIELD_PARAMETER]: JSON.stringify(nodeFields),
            login_profile: config.login_profile ?? ''
        }
    };

    return itemConfig;
}

