import { IFieldConfig } from '@actiwaredevelopment/io-sdk-typescript-models';

import { v4 as uuidv4 } from 'uuid';

export interface IDataQueryExampleQuery {
    id?: string;
    name?: string;
    description?: string;
    query?: string;
    field_mappings?: IFieldConfig[];
}

export function getDefaultQueryConfig(): IDataQueryExampleQuery {
    return {
        id: uuidv4(),
        name: '',
        field_mappings: []
    };
}

