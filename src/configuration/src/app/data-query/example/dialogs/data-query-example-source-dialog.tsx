import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';
import { IHttpCredential } from '@actiwaredevelopment/io-sdk-typescript-models';
import { SyntaxComboBox } from '@actiwaredevelopment/io-sdk-react';
import {
    DefaultButton,
    Dialog,
    DialogFooter,
    IDialogProps,
    MessageBar,
    MessageBarType,
    PrimaryButton,
    Stack,
    Text,
    TextField
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IDataQueryExampleSource } from '../models';
import { SourceErrorType, SourceWarningType, validateDataSourceConfig } from '../validation';
import { HTTP_CREDENTIAL_STORE_ID, VALIDATION_TIMEOUT } from '../../../models';
import { useHttpLoginProfileOptions } from '../../../hooks';
import { credentialUtils } from '../../../utils';

type InputChangeType = keyof Pick<IDataQueryExampleSource, 'name' | 'login_profile'>;

interface IDataQuerySourceDialogProps extends IDialogProps {
    actionType: DataQuerySourceActionType;
    blockedNames: string[];
    config: IDataQueryExampleSource;
    loginProfiles: IHttpCredential[];
    sources: IDataQueryExampleSource[];

    onSubmit: (config: IDataQueryExampleSource) => void;
}

export type DataQuerySourceActionType = 'NEW' | 'DUPLICATE' | 'EDIT';

export interface IDataQuerySourceDialogConfig {
    actionType: DataQuerySourceActionType;
    blockedNames: string[];
    config: IDataQueryExampleSource;
    show: boolean;
    sources: IDataQueryExampleSource[];
}

export const DataQuerySourceDialog: React.FunctionComponent<IDataQuerySourceDialogProps> = (props) => {
    const { t: translate } = useTranslation();

    const [config, setConfig] = useState<IDataQueryExampleSource>(props.config);
    const [errors, setErrors] = useState<SourceErrorType>({});
    const [warnings, setWarnings] = useState<SourceWarningType>({});

    const loginProfileOptions = useHttpLoginProfileOptions(props.loginProfiles ?? []);

    const timeoutIdRef = useRef<NodeJS.Timeout>();

    const isValid = Object.keys(errors).length === 0;
    const primaryButtonDisabled = !config.name || !!props.blockedNames.includes(config.name) || !isValid;

    let title = translate('text.TITLE_MODIFY_SOURCE', 'Modify Source');
    let primaryButtonText = translate('text.BUTTON_SAVE', 'Save');

    switch (props.actionType) {
        case 'DUPLICATE':
            title = translate('text.TITLE_CLONE_SOURCE', 'Duplicate Source');
            primaryButtonText = translate('text.BUTTON_CLONE_SOURCE', 'Duplicate');
            break;

        case 'NEW':
            title = translate('text.TITLE_ADD_SOURCE', 'Add Source');
            primaryButtonText = translate('text.BUTTON_ADD', 'Add');
            break;
    }

    // Validate configuration
    useEffect(() => {
        clearTimeout(timeoutIdRef.current);

        timeoutIdRef.current = setTimeout(() => {
            const [errors, warnings] = validateDataSourceConfig(config, props.blockedNames, props.sources);

            // This will cause two rerenders, be cautious with additional changes
            setErrors(errors);
            setWarnings(warnings);
        }, VALIDATION_TIMEOUT);
    }, [config, props.blockedNames, props.sources]);

    function handleAfterDismiss() {
        // Chain callback
        props.modalProps?.onDismissed?.();
    }

    function handleDismiss(event?: React.MouseEvent<HTMLButtonElement>) {
        // Chain callback
        props.onDismiss?.(event);
    }

    function handlePrimaryButtonClick() {
        props.onSubmit(config);
    }

    function handleInputChange(property: InputChangeType, newValue?: string) {
        setConfig((current) => ({
            ...current,
            [property]: newValue ?? ''
        }));
    }

    function handleOpenCredentialWizard() {
        DesignerAPI.system.openCredentialWizard([HTTP_CREDENTIAL_STORE_ID], (credentials) => {
            const httpLoginProfile = credentialUtils.parseHttpCredentials(credentials);

            // The Designer API only returns the new element. If the number of login profiles
            // does not equal one, something must have gone wrong.
            if (httpLoginProfile.length !== 1) {
                return;
            }

            setConfig((current) => ({
                ...current,
                login_profile: httpLoginProfile[0].id
            }));
        });
    }

    return (
        <Dialog
            minWidth='32rem'
            {...props}
            onDismiss={handleDismiss}
            dialogContentProps={{
                ...props.dialogContentProps,
                title
            }}
            modalProps={{
                ...props.modalProps,
                onDismissed: handleAfterDismiss,
                isBlocking: true
            }}>
            <Stack
                tokens={{
                    childrenGap: '0.5rem'
                }}>
                <TextField
                    autoFocus
                    required
                    errorMessage={errors.name ?? ''}
                    label={translate('text.LABEL_SOURCE_NAME', 'Name')}
                    onChange={(_, value) => handleInputChange('name', value ?? '')}
                    placeholder={translate('text.PLACEHOLDER_SOURCE_NAME', 'Please enter here the name of your source')}
                    value={config.name ?? ''}
                />

                <SyntaxComboBox
                    errorMessage={errors.login_profile ?? ''}
                    label={translate('text.LABEL_LOGIN_PROFILE', 'Which login profile should be used?')}
                    onChange={(_, option) => handleInputChange('login_profile', option?.key.toString())}
                    onSyntax={handleOpenCredentialWizard}
                    options={loginProfileOptions}
                    placeholder={translate('text.PLACEHOLDER_LOGIN_PROFILE', 'Select a login profile here')}
                    selectedKey={config.login_profile ?? ''}
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

                {warnings.source && (
                    <MessageBar
                        messageBarType={MessageBarType.warning}
                        dismissButtonAriaLabel='Close'>
                        <Text>{warnings.source}</Text>
                    </MessageBar>
                )}
            </Stack>

            <DialogFooter>
                <PrimaryButton
                    text={primaryButtonText}
                    disabled={primaryButtonDisabled}
                    onClick={handlePrimaryButtonClick}
                />

                <DefaultButton
                    text={translate('text.BUTTON_CANCEL', 'Cancel')}
                    onClick={() => handleDismiss()}
                />
            </DialogFooter>
        </Dialog>
    );
};
