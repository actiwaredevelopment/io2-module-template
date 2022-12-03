import { IDataQueryExampleSourceConfigProps } from '../dialogs/data-query-example-source-dialog';
import { CREDENTIAL_STORE_ID } from '../../../models/constants';

import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageBar, MessageBarType, Stack, TextField } from '@fluentui/react';
import { SyntaxComboBox } from '@actiwaredevelopment/io-sdk-react';

import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import { useCredentialsAsOptions } from '../../../hooks';

export const DataQueryExampleSourceConfig: React.FunctionComponent<IDataQueryExampleSourceConfigProps> = (props) => {
    const { t: translate } = useTranslation();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const credentialOptions = useCredentialsAsOptions(props.systemInfo ?? {}, true);

    useEffect(() => {
        props?.onValidate?.(props.config, (errors) => {
            setErrors(errors ?? {});
        });
    }, [props, props.onValidate, props.config]);

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

    return (
        <Fragment>
            <Stack
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                {errors?.warning_source?.length > 0 && (
                    <MessageBar
                        messageBarType={MessageBarType.warning}
                        isMultiline={true}
                        dismissButtonAriaLabel='Close'>
                        {errors?.warning_source}
                    </MessageBar>
                )}

                <TextField
                    label={translate('text.LABEL_SOURCE_NAME', 'Name')}
                    placeholder={translate('text.PLACEHOLDER_SOURCE_NAME', 'Please enter here the name of your source')}
                    errorMessage={errors?.name ?? ''}
                    value={props.config?.name}
                    onChange={(_, value) => handleInputChange('name', value ?? '')}
                />

                <SyntaxComboBox
                    onSyntax={handleOpenCredentialWizard}
                    options={credentialOptions}
                    label={translate('text.LABEL_LOGIN_PROFILE', 'Which login profile should be used?')}
                    placeholder={translate('text.PLACEHOLDER_LOGIN_PROFILE', 'Select a login profile here')}
                    errorMessage={errors?.login_profile ?? ''}
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
            </Stack>
        </Fragment>
    );
};

