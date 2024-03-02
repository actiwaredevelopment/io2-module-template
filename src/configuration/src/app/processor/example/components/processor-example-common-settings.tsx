import { SyntaxComboBox, SyntaxTextField } from '@actiwaredevelopment/io-sdk-react';
import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import { IProcessorExampleConfigProps } from './processor-example-config';

import { Stack } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

import { useHttpLoginProfileOptions } from '../../../hooks';
import { IProcessorExampleConfig } from '../models';

type InputChangeType = keyof Pick<IProcessorExampleConfig, 'login_profile' | 'name'>;
type SyntaxChangeType = keyof Pick<IProcessorExampleConfig, 'name'>;

export const ProcessorCommonSettings: React.FunctionComponent<IProcessorExampleConfigProps> = (props) => {
    const { t: translate } = useTranslation();

    const credentialOptions = useHttpLoginProfileOptions(props.loginProfiles, 'id', true);

    function handleInputChange(property: InputChangeType, newValue?: string) {
        props.onChange({
            ...props.config,
            [property]: newValue ?? ''
        });
    }

    function handleSyntaxChange(property: SyntaxChangeType) {
        DesignerAPI.system.openSyntaxWizard(props.config[property] ?? '', undefined, (newValue) =>
            handleInputChange(property, newValue)
        );
    }

    return (
        <Stack
            verticalAlign='start'
            horizontalAlign='stretch'
            tokens={{
                childrenGap: '0.5rem'
            }}>
            <SyntaxComboBox
                errorMessage={props.errors.login_profile}
                label={translate('text.LABEL_LOGIN_PROFILE', 'Which login profile should be used?')}
                onChange={(_, option) => handleInputChange('login_profile', option?.key.toString())}
                onSyntax={props.onAddCredential}
                options={credentialOptions}
                placeholder={translate('text.PLACEHOLDER_LOGIN_PROFILE', 'Select a login profile here')}
                selectedKey={props.config.login_profile ?? ''}
                iconButtonProps={{
                    iconProps: {
                        iconName: 'fa-plus'
                    }
                }}
                styles={{
                    container: {
                        flexGrow: 1
                    }
                }}
                syntaxProps={{
                    tooltip: translate('text.TOOLTIP_ADD_LOGIN_PROFILE', 'Add a new login profile')
                }}
            />

            <SyntaxTextField
                errorMessage={props.errors.name}
                label={translate('text.LABEL_NAME', 'Please enter a name here')}
                onChange={(_, newValue) => handleInputChange('name', newValue)}
                placeholder={translate('text.PLACEHOLDER_NAME', 'Select a login profile here')}
                onSyntax={() => handleSyntaxChange('name')}
                syntaxFields={props.contextMenuItems}
                value={props.config.name ?? ''}
            />

            {/* Place additional configuration elements here. */}
        </Stack>
    );
};

