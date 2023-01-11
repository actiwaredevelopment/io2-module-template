import { IProcessorExampleConfigProps } from './processor-example-config';

import { useTranslation } from 'react-i18next';

import { Stack } from '@fluentui/react';
import { SyntaxComboBox } from '@actiwaredevelopment/io-sdk-react';

import { useCredentialsAsOptions } from '../../../hooks';

export const ProcessorExampleCommonSettings: React.FunctionComponent<IProcessorExampleConfigProps> = (props) => {
    const { t: translate } = useTranslation();

    const credentialOptions = useCredentialsAsOptions(props.systemInfo ?? {}, true);

    function handleInputChange(property?: string, newValue?: string | number | boolean) {
        if (!property?.length) {
            return;
        }

        props.onChange?.({
            ...props.config,
            [property]: newValue ?? ''
        });
    }

    // function handleOpenSyntax(property?: string, value?: string) {
    //     if (!property?.length) {
    //         return;
    //     }

    //     DesignerAPI.system.openSyntaxWizard(value ?? '', undefined, (newValue) => {
    //         handleInputChange(property, newValue);
    //     });
    // }

    return (
        <Stack>
            <Stack
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <SyntaxComboBox
                    onSyntax={props.onAddCredential}
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

                {/* <SyntaxTextField
                    label={translate(
                        'text.LABEL_ANALYZE_AGAINST_MODERATION_CATEGORIES',
                        'Which text should be analyze against moderation categories?'
                    )}
                    placeholder={translate(
                        'text.PLACEHOLDER_ANALYZE_AGAINST_MODERATION_CATEGORIES',
                        'Please enter the input text here'
                    )}
                    errorMessage={props.errors?.input ?? ''}
                    value={props.config?.input ?? ''}
                    syntaxFields={props.systemInfo?.context_menus}
                    onSyntax={() => {
                        handleOpenSyntax('input', props.config?.input);
                    }}
                    onChange={(_, value) => handleInputChange('input', value ?? '')}
                /> */}

                {/* <Toggle
                    inlineLabel
                    checked={props.config?.remove_json_files === true}
                    onChange={(_, checked) =>
                        handleInputChange(
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

