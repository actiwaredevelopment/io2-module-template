import { DataQueryExampleSourceConfig } from '../components/data-query-example-source-config';
import { IDataQueryExampleSource } from '../models';
import { ISystemInfoResponse } from '@actiwaredevelopment/io-sdk-typescript-designer';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DefaultButton, Dialog, DialogFooter, IDialogContentProps, IDialogProps, PrimaryButton } from '@fluentui/react';

import { validateDataSourceConfig } from '../validation';

export type DataQueryExampleSourceActionType = 'NEW' | 'DUPLICATE' | 'EDIT';

export interface IDataQueryExampleSourceDialogConfig {
    show?: boolean;
    actionType?: DataQueryExampleSourceActionType;

    systemInfo?: ISystemInfoResponse;

    blockedNames?: string[];
    sources?: IDataQueryExampleSource[];

    config?: IDataQueryExampleSource;
}

export interface IDataQueryExampleSourceDialogProps extends IDataQueryExampleSourceDialogConfig, IDialogProps {
    onSubmit?: (config?: IDataQueryExampleSource) => void;
}

export interface IDataQueryExampleSourceConfigProps {
    config?: IDataQueryExampleSource;
    systemInfo?: ISystemInfoResponse;

    onChange?: (config: IDataQueryExampleSource) => void;
    onValidate?: (config?: IDataQueryExampleSource, callback?: (error?: Record<string, string>) => void) => void;
}

export const DataQueryExampleSourceDialog: React.FunctionComponent<IDataQueryExampleSourceDialogProps> = (props) => {
    const { t: translate } = useTranslation();

    const [formData, setFormData] = useState<IDataQueryExampleSource | undefined>(props.config);

    const [isValid, setValidState] = useState<boolean>(false);

    const primaryButtonDisabled = !formData?.name || !!props.blockedNames?.includes(formData.name) || isValid !== true;

    let title = '';
    let primaryButtonText = '';

    switch (props.actionType) {
        case 'DUPLICATE':
            title = translate('text.TITLE_CLONE_SOURCE', 'Duplicate Source');
            primaryButtonText = translate('text.BUTTON_DUPLICATE_SOURCE', 'Duplicate');
            break;
        case 'NEW':
            title = translate('text.TITLE_ADD_SOURCE', 'Add Source');
            primaryButtonText = translate('text.BUTTON_ADD', 'Add');
            break;

        default:
            title = translate('text.TITLE_MODIFY_SOURCE', 'Modify Source');
            primaryButtonText = translate('text.BUTTON_SAVE', 'Save');
    }

    const dialogContentProps: IDialogContentProps = {
        title,
        ...props.dialogContentProps
    };

    function handleAfterDismiss() {
        setFormData(undefined);

        // Chain callback
        props.modalProps?.onDismissed?.();
    }

    function handleDismiss(event?: React.MouseEvent<HTMLButtonElement>) {
        // Chain callback
        props.onDismiss?.(event);
    }

    async function handlePrimaryButtonClick() {
        if (!formData) {
            return;
        }

        props.onSubmit?.(formData);
    }

    function handleConfigChange(config?: IDataQueryExampleSource) {
        if (!config) {
            return;
        }

        setFormData(config);
    }

    function handleValidateConfig(
        config?: IDataQueryExampleSource,
        callback?: (error?: Record<string, string>) => void
    ) {
        const errors: Record<string, string> = {};

        if (config) {
            const isValid = validateDataSourceConfig(config, props.blockedNames, props.sources, translate, callback);

            setValidState(isValid);

            return;
        }

        callback?.(errors);
    }

    return (
        <Dialog
            minWidth='32rem'
            {...props}
            dialogContentProps={dialogContentProps}
            onDismiss={handleDismiss}
            modalProps={{
                ...props.modalProps,
                onDismissed: handleAfterDismiss,
                isBlocking: true
            }}>
            <DataQueryExampleSourceConfig
                config={formData}
                systemInfo={props.systemInfo}
                onChange={handleConfigChange}
                onValidate={handleValidateConfig}
            />

            <DialogFooter>
                <PrimaryButton
                    text={primaryButtonText}
                    disabled={primaryButtonDisabled}
                    onClick={handlePrimaryButtonClick}
                />

                <DefaultButton
                    text={translate('text.BUTTON_CANCEL', 'Cancel')}
                    onClick={() => {
                        handleDismiss();
                    }}
                />
            </DialogFooter>
        </Dialog>
    );
};

