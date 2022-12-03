import { IProcessorExampleConfigProps } from './processor-example-config';
import { CREDENTIAL_STORE_ID } from '../../../models/constants';

import { useTranslation } from 'react-i18next';

import { Stack } from '@fluentui/react';
import { SyntaxComboBox } from '@actiwaredevelopment/io-sdk-react';

import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import { useCredentialsAsOptions } from '../../../hooks';

export const ProcessorExampleCommonSettings: React.FunctionComponent<IProcessorExampleConfigProps> = (props) => {
    const { t: translate } = useTranslation();

    const credentialOptions = useCredentialsAsOptions(props.systemInfo ?? {}, true);

    function handleOpenCredentialWizard() {
        DesignerAPI.system.openCredentialWizard([CREDENTIAL_STORE_ID]);
    }

    function handleInputChange(property?: string, newValue?: string) {
        if (!property?.length) {
            return;
        }

        props.onChange?.({
            ...props.config,
            [property]: newValue ?? ''
        });
    }

    // function handleToggleChanged(property: string, newValue?: boolean) {
    //     props.onChange?.({
    //         ...props.config,
    //         [property]: newValue === true,
    //     });
    // }

    return (
        <Stack>
            <Stack
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <SyntaxComboBox
                    onSyntax={handleOpenCredentialWizard}
                    options={credentialOptions}
                    label={translate('text.LABEL_LOGIN_PROFILE', 'Which login profile should be used?')}
                    placeholder={translate('text.PLACEHOLDER_LOGIN_PROFILE', 'Select a login profile here')}
                    errorMessage={props.errors?.login_profile ?? ''}
                    selectedKey={props.config?.login_profile ?? ''}
                    iconButtonProps={{
                        iconProps: {
                            iconName: 'fa-plus'
                        }
                    }}
                    syntaxProps={{
                        tooltip: translate('text.TOOLTIP_ADD_LOGIN_PROFILE', 'Add a new login profile')
                    }}
                    onChange={(_, option) => handleInputChange('login_profile', option?.key.toString() ?? '')}
                    styles={{
                        container: {
                            width: '100%'
                        }
                    }}
                />

                {/* <Toggle
                    inlineLabel
                    checked={props.config?.remove_json_files === true}
                    onChange={(_, checked) =>
                        handleToggleChanged(
                            "remove_json_files",
                            checked === true
                        )
                    }
                    label={translate(
                        "text.CHECKBOX_REMOVE_JSON_FILES",
                        "Remove JSON files from the container after successful processing."
                    )}
                /> */}
            </Stack>
        </Stack>
    );
};

