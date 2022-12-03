import { IDataQueryExampleQuery } from './data-query-example-query';

export interface IDataQueryExampleSource {
    id?: string;
    name?: string;
    login_profile?: string;
    queries?: IDataQueryExampleQuery[];
}

