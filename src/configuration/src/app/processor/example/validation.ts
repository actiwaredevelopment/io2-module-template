import { IProcessorExampleConfig } from './models';

import { TFunction } from 'i18next';

const ERROR_NO_LOGIN_PROFILE_SELECTED = 'No login profile was selected, please select a login profile.';
const ERROR_NO_NAME_GIVEN = 'No name entered, please enter a name.';

type ConfigRequiredType = keyof Pick<IProcessorExampleConfig, 'login_profile' | 'name'>;
export type ConfigErrorType = Partial<Record<ConfigRequiredType, string>>;

export function validateConfig(config: IProcessorExampleConfig, translate?: TFunction): ConfigErrorType {
    const errors: ConfigErrorType = {};

    if (!config.login_profile) {
        errors.login_profile =
            translate?.('exception.ERROR_NO_LOGIN_PROFILE_SELECTED', ERROR_NO_LOGIN_PROFILE_SELECTED) ??
            ERROR_NO_LOGIN_PROFILE_SELECTED;
    }

    if (!config.name) {
        errors.name = translate?.('exception.ERROR_NO_NAME_GIVEN', ERROR_NO_NAME_GIVEN) ?? ERROR_NO_NAME_GIVEN;
    }

    return errors;
}
