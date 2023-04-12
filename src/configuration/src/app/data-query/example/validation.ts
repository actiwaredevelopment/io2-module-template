import { IFieldConfig } from '@actiwaredevelopment/io-sdk-typescript-models';
import { TFunction } from 'i18next';

import { IDataQueryExampleSource, IDataQueryExampleQuery } from './models';

const ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME =
    'The entered name cannot be used because an invalid character has been used. Please make sure that none of the following characters are used in the name: {{chars}} is used.';
const ERROR_DATA_QUERY_NAME_ALREADY_EXISTS = 'A query with the specified name already exists';
const ERROR_DATA_QUERY_NAME_MISSING = 'No name entered for the query, please enter a name for the query.';
const ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS = 'A source with the specified name already exists';
const ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING =
    'No login profile selected for the source, please select a login profile for the source.';
const ERROR_DATA_QUERY_SOURCE_NAME_MISSING = 'No name entered for the source,  please enter a name for the source.';
const ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS =
    'A source with the selected login profile already exists';
const ERROR_DATA_QUERY_STATEMENT_MISSING =
    'No statement entered for the query, please enter a statement for the query.';
const ERROR_FIELD_MAPPING_NO_NAME = 'No name entered for the field mapping, please enter a name for the field mapping.';
const ERROR_FIELD_MAPPING_NO_VALUE =
    'No value entered for the field mapping, please enter a value for the field mapping.';

export type DataQueryErrorType = Partial<Record<DataQueryRequiredType, string>>;
export type SourceErrorType = Partial<Record<SourceRequiredType, string>>;
export type SourceWarningType = Partial<Record<'source', string>>;
type DataQueryRequiredType = keyof Pick<IDataQueryExampleQuery, 'name' | 'query'>;
type SourceRequiredType = keyof Pick<IDataQueryExampleSource, 'name' | 'login_profile'>;

export function validateDataSourceConfig(
    config: IDataQueryExampleSource,
    blockedNames: string[],
    sources: IDataQueryExampleSource[],
    translate?: TFunction
): [SourceErrorType, SourceWarningType] {
    const errors: SourceErrorType = {};
    const warnings: SourceWarningType = {};

    if (!config.name) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_SOURCE_NAME_MISSING', ERROR_DATA_QUERY_SOURCE_NAME_MISSING) ??
            ERROR_DATA_QUERY_SOURCE_NAME_MISSING;
    }

    if (!errors?.name?.length && config.name?.includes('.') === true) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME', ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME, {
                chars: '.'
            }) ?? ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME;
    }

    const isDuplicate = !!blockedNames?.some((search) => search.toLowerCase() === config.name?.toLowerCase());

    if (isDuplicate) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS', ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS) ??
            ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS;
    }

    if (!config.login_profile?.length) {
        errors.login_profile =
            translate?.(
                'exception.ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING',
                ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING
            ) ?? ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING;
    }

    const sourceExists = !!sources?.some((search) => search.login_profile === config.login_profile);

    if (sourceExists) {
        warnings.source =
            translate?.(
                'exception.ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS',
                ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS
            ) ?? ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS;
    }

    return [errors, warnings];
}

export function validateDataQueryConfig(
    config: IDataQueryExampleQuery,
    blockedNames: string[],
    translate?: TFunction
): DataQueryErrorType {
    const errors: DataQueryErrorType = {};

    if (!config.name) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_NAME_MISSING', ERROR_DATA_QUERY_NAME_MISSING) ??
            ERROR_DATA_QUERY_NAME_MISSING;
    }

    if (config.name?.includes('.') === true) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME', ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME, {
                chars: '.'
            }) ?? ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME;
    }

    const isDuplicate = blockedNames.some((search) => search.toLowerCase() === config.name?.toLowerCase());

    if (isDuplicate) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_NAME_ALREADY_EXISTS', ERROR_DATA_QUERY_NAME_ALREADY_EXISTS) ??
            ERROR_DATA_QUERY_NAME_ALREADY_EXISTS;
    }

    if (!config.query) {
        errors.query =
            translate?.('exception.ERROR_DATA_QUERY_STATEMENT_MISSING', ERROR_DATA_QUERY_STATEMENT_MISSING) ??
            ERROR_DATA_QUERY_STATEMENT_MISSING;
    }

    return errors;
}

export function validateFieldMapping(item: IFieldConfig, translate?: TFunction): string {
    if (!item.name) {
        return (
            translate?.('exception.ERROR_FIELD_MAPPING_NO_NAME', ERROR_FIELD_MAPPING_NO_NAME) ??
            ERROR_FIELD_MAPPING_NO_NAME
        );
    }

    if (!item.value) {
        return (
            translate?.('exception.ERROR_FIELD_MAPPING_NO_VALUE', ERROR_FIELD_MAPPING_NO_VALUE) ??
            ERROR_FIELD_MAPPING_NO_VALUE
        );
    }

    return '';
}
