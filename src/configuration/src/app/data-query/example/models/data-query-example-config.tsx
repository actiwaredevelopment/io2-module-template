import { IDataQueryExampleSource } from './data-query-example-source';

export const ADD_IN_ID = '00000000-0000-0000-0000-000000000000';

export const CONFIG_KEY = 'data-query-example-config';
export const DATA_SOURCE_QUERY_DELIMITER = '.';

export interface IDataQueryExampleConfig {
    sources?: IDataQueryExampleSource[];
}

