import { IDataQueryExampleSource } from './models';
import { IFieldConfig } from '@actiwaredevelopment/io-sdk-typescript-models';
import { IDataQueryExampleQuery } from './models/data-query-example-query';

import { TFunction } from 'i18next';

const ERROR_DATA_QUERY_SOURCE_NAME_MISSING = 'No name entered for the source,  please enter a name for the source.';
const ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME =
    'The entered name cannot be used because an invalid character has been used. Please make sure that none of the following characters are used in the name: {{chars}} is used.';
const ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING =
    'No login profile selected for the source, please select a login profile for the source.';
const ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS = 'A source with the specified name already exists';
const ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS =
    'A source with the selected login profile already exists';

const ERROR_DATA_QUERY_NAME_MISSING = 'No name entered for the query, please enter a name for the query.';
const ERROR_DATA_QUERY_NAME_ALREADY_EXISTS = 'A query with the specified name already exists';
const ERROR_DATA_QUERY_ALREADY_EXISTS = 'A query with the specified name already exists';
const ERROR_DATA_QUERY_STATEMENT_MISSING =
    'No statement entered for the query, please enter a statement for the query.';

const ERROR_FIELD_MAPPING_NO_NAME = 'No name entered for the field mapping, please enter a name for the field mapping.';
const ERROR_FIELD_MAPPING_NO_VALUE =
    'No value entered for the field mapping, please enter a value for the field mapping.';

export function validateDataSourceConfig(
    config: IDataQueryExampleSource,
    blockedNames?: string[],
    sources?: IDataQueryExampleSource[],
    translate?: TFunction,
    callback?: (error?: Record<string, string>) => void
): boolean {
    const errors: Record<string, string> = {};

    if (!config) {
        return false;
    }

    if (!config?.name?.length) {
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

    if (
        !errors?.name?.length &&
        blockedNames?.some((search) => search.toLowerCase() === config.name?.toLowerCase()) === true
    ) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS', ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS, {
                chars: '.'
            }) ?? ERROR_DATA_QUERY_SOURCE_ALREADY_EXISTS;
    }

    if (!config.login_profile?.length) {
        errors.login_profile =
            translate?.(
                'exception.ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING',
                ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING
            ) ?? ERROR_DATA_QUERY_SOURCE_LOGIN_PROFILE_MISSING;
    }

    if (
        sources?.some((search) => search.login_profile?.toLowerCase() === config.login_profile?.toLowerCase()) === true
    ) {
        errors.warning_source =
            translate?.(
                'exception.ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS',
                ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS
            ) ?? ERROR_DATA_QUERY_SOURCE_WITH_LOGIN_PROFILE_ALREADY_EXISTS;
    }

    callback?.(errors);

    return Object.keys(errors).length === 0;
}

export function validateDataQueryConfig(
    config: IDataQueryExampleQuery,
    blockedNames?: string[],
    source?: IDataQueryExampleSource,
    translate?: TFunction,
    callback?: (error?: Record<string, string>) => void
) {
    const errors: Record<string, string> = {};

    if (!config) {
        return false;
    }

    if (!config?.name?.length) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_NAME_MISSING', ERROR_DATA_QUERY_NAME_MISSING) ??
            ERROR_DATA_QUERY_NAME_MISSING;

        errors.queryError = '1';
    }

    if (!errors?.name?.length && config?.name?.includes('.') === true) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME', ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME, {
                chars: '.'
            }) ?? ERROR_DATA_QUERY_INVALID_CHAR_IN_NAME;

        errors.queryError = '1';
    }

    if (
        !errors?.name?.length &&
        blockedNames?.some((search) => search.toLowerCase() === config.name?.toLowerCase()) === true
    ) {
        errors.name =
            translate?.('exception.ERROR_DATA_QUERY_NAME_ALREADY_EXISTS', ERROR_DATA_QUERY_NAME_ALREADY_EXISTS, {
                chars: '.'
            }) ?? ERROR_DATA_QUERY_NAME_ALREADY_EXISTS;
    }

    if (!config?.query?.length) {
        errors.query =
            translate?.('exception.ERROR_DATA_QUERY_STATEMENT_MISSING', ERROR_DATA_QUERY_STATEMENT_MISSING) ??
            ERROR_DATA_QUERY_STATEMENT_MISSING;
        errors.queryError = '1';
    }

    if (source?.queries && source?.queries?.length > 0) {
        if (
            source.queries.findIndex((search) => {
                return (
                    search.name?.toLowerCase() === config?.name?.toLowerCase() &&
                    search.id?.toLowerCase() !== config?.id?.toLowerCase()
                );
            }) > -1
        ) {
            errors.name =
                translate?.('exception.ERROR_DATA_QUERY_ALREADY_EXISTS', ERROR_DATA_QUERY_ALREADY_EXISTS) ??
                ERROR_DATA_QUERY_ALREADY_EXISTS;
        }
    }

    // if (config?.field_mappings !== undefined && item.field_mappings.length > 0) {
    //     if (item.field_mappings.findIndex((search) => { return isNullOrUndefined(search.field_name) === true || search.field_name === '' || isNullOrUndefined(search.mapping_name) === true || search.mapping_name === ''; }) > -1) {
    //         error.field_mappings = translate?.('exception.ERROR_DATA_QUERY_FIELD_MAPPING_ISSUE', ERROR_DATA_QUERY_FIELD_MAPPING_ISSUE) ?? ERROR_DATA_QUERY_FIELD_MAPPING_ISSUE;
    //     }
    // }

    callback?.(errors || {});

    return Object.keys(errors).length === 0;
}

export function validateFieldMapping(item: IFieldConfig, translate?: TFunction) {
    if (!item?.name?.length) {
        return (
            translate?.('exception.ERROR_FIELD_MAPPING_NO_NAME', ERROR_FIELD_MAPPING_NO_NAME) ??
            ERROR_FIELD_MAPPING_NO_NAME
        );
    }

    if (!item?.value?.length) {
        return (
            translate?.('exception.ERROR_FIELD_MAPPING_NO_VALUE', ERROR_FIELD_MAPPING_NO_VALUE) ??
            ERROR_FIELD_MAPPING_NO_VALUE
        );
    }

    return;
}

