import { IProcessorExampleConfig } from './models';

import { TFunction } from 'i18next';

const ERROR_NO_LOGIN_PROFILE_SELECTED = 'No login profile was selected, please select a login profile.';

type ConfigErrorProperties = keyof Partial<Pick<IProcessorExampleConfig, 'login_profile'>>;
export type ConfigErrorType = Partial<Record<ConfigErrorProperties, string>>;

export function validateConfig(
    config: IProcessorExampleConfig,
    translate?: TFunction,
    callback?: (error?: ConfigErrorType) => void
): boolean {
    const errors: ConfigErrorType = {};

    if (!config) {
        return false;
    }

    if (!config.login_profile?.length) {
        errors.login_profile =
            translate?.('exception.ERROR_NO_LOGIN_PROFILE_SELECTED', ERROR_NO_LOGIN_PROFILE_SELECTED) ??
            ERROR_NO_LOGIN_PROFILE_SELECTED;
    }

    callback?.(errors);

    return Object.keys(errors).length === 0;
}

