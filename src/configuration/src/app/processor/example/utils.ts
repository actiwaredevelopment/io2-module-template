import { CONFIG_KEY, IProcessorExampleConfig } from "./models";
import { IItemConfig } from "@actiwaredevelopment/io-sdk-typescript-models";

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

    (itemConfig.parameters ??= {})[CONFIG_KEY] = JSON.stringify(config);

    return itemConfig;
}
