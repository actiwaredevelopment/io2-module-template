import { IItemConfig } from '@actiwaredevelopment/io-sdk-typescript-models';
import { v4 as uuidv4 } from 'uuid';

import { IDataQueryExampleConfig, IDataQueryExampleQuery, IDataQueryExampleSource } from './models';

export const ADD_IN_ID = '45fac709-7ff6-4b0e-8998-7e0b1524a626';
export const ALTERNATIVE_CONFIG_KEY = 'data-query-example-config-json';
export const CONFIG_KEY = 'data-query-example-config';
export const DATA_SOURCE_QUERY_DELIMITER = '.';

/**
 * Convert a given configuration object into the `IItemConfig` which will be used to save
 * the configuration. This meanas the configuration will be JSON.stringified.
 *
 * @param config The configuration object
 *
 * @throws If the object could not be stringified.
 *
 * @returns an `IItemConfig` containing the stringified configuration.
 */
export function convertToItemConfig(config: IDataQueryExampleConfig): IItemConfig {
    const itemConfig: IItemConfig = {
        parameters: {
            [CONFIG_KEY]: JSON.stringify(config)
        }
    };

    return itemConfig;
}

/**
 * Function to create default configuration. Can be used to create new
 * configurations or default configurations.
 *
 * @returns A new default configuration
 */
export function getDefaultDataQueryConfig(): IDataQueryExampleConfig {
    return {
        sources: []
    };
}

/**
 * Function to create default configuration. Can be used to create new
 * configurations or default configurations.
 *
 * @returns A new default configuration
 */
export function getDefaultQueryConfig(): IDataQueryExampleQuery {
    return {
        id: uuidv4(),
        field_mappings: []
    };
}

/**
 * Function to create default configuration. Can be used to create new
 * configurations or default configurations.
 *
 * @returns A new default configuration
 */
export function getDefaultSourceConfig(): IDataQueryExampleSource {
    return {
        id: uuidv4(),
        queries: []
    };
}

/**
 * A function used to provide IDs to configurations, so that they ca be uniquely identified in
 * lists.
 *
 * @param config The configuration object which will be upgraded.
 *
 * @returns The upgraded configuration containing IDs for configuration elements.
 */
export function upgradeConfig(config: IDataQueryExampleConfig): IDataQueryExampleConfig {
    const sources: IDataQueryExampleSource[] = [];

    for (const source of config.sources ?? []) {
        const queries: IDataQueryExampleQuery[] = [];

        source.id = source.id ?? uuidv4();

        for (const query of source.queries ?? []) {
            query.id = query.id ?? uuidv4();
            query.field_mappings = (query.field_mappings ?? []).map((mapping) => ({
                ...mapping,
                id: mapping.id ?? uuidv4()
            }));

            queries.push(query);
        }

        sources.push({
            ...source,
            queries
        });
    }

    config.sources = sources;

    return config;
}
