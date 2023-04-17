import { IFieldConfig } from '@actiwaredevelopment/io-sdk-typescript-models';

export interface IDataQueryExampleConfig {
    sources?: IDataQueryExampleSource[];
}

export interface IDataQueryExampleQuery {
    id?: string;
    name?: string;
    description?: string;
    query?: string;
    field_mappings?: IFieldConfig[];
}

export interface IDataQueryExampleSource {
    id?: string;
    name?: string;
    login_profile?: string;
    queries?: IDataQueryExampleQuery[];
}

export interface IDataQueryState {
    isTesting?: boolean;
}

export interface IDataQueryStates {
    [queryId: string]: IDataQueryState | undefined;
}
