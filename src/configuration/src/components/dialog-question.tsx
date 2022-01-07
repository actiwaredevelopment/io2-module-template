import React, { useState } from 'react';
import {
    Trans,
    useTranslation
} from 'react-i18next';

import {
    DefaultButton,
    Dialog,
    IDialogContentStyles,
    IDialogProps,
    IModalStyles,
    mergeStyles,
    PrimaryButton,
    Spinner,
    SpinnerSize,
    Stack,
    useTheme
} from '@fluentui/react';

export interface IDialogQuestionProps extends IDialogProps {
    languageCode?: string;
    defaultText?: string;


    args?: any;

    onConfirm?: () => void;
    onDecline?: () => void;
    onDismiss?: () => void;
}

export const DialogQuestion: React.FunctionComponent<IDialogQuestionProps> = (props) => {
    const { t: translate } = useTranslation('module');
    const theme = useTheme();

    const [submitting, setSubmitting] = useState(false);

    function handleSubmit() {
        if (submitting === false) {
            setSubmitting(true);

            props.onConfirm?.();

            setSubmitting(false);
        }
    }

    function handleDecline() {
        if (submitting === false) {
        // Chain callback
            props.onDecline?.();
        }
    }

    function handleAfterDismiss() {
        if (submitting === false) {
        // Chain callback
            props.onDismiss?.();
        }
    }

    return (
        <Dialog
            maxWidth=''
            {...props}
            onDismiss={handleAfterDismiss}
            dialogContentProps={{
                ...props.dialogContentProps,
                styles: {
                    ...props.dialogContentProps?.styles,
                    inner: mergeStyles(
                        (props.dialogContentProps?.styles as IDialogContentStyles)?.inner
                    ),
                    innerContent: mergeStyles(
                        (props.dialogContentProps?.styles as IDialogContentStyles)?.innerContent
                    )
                }
            }}
            modalProps={{
                ...props.modalProps,
                onDismissed: handleAfterDismiss,
                styles: {
                    ...props.modalProps?.styles,
                    scrollableContent: mergeStyles(
                        (props.modalProps?.styles as IModalStyles)?.scrollableContent
                    )
                }
            }}
        >
            <Stack>

                <Trans i18nKey={props.languageCode} values={props.args}>
                    {props.defaultText}
                </Trans>

                <Stack
                    horizontal
                    horizontalAlign='end'
                    tokens={{
                        childrenGap: '0.5rem'
                    }}
                    styles={{
                        root: {
                            padding: '1rem 0 0 0',
                            position: 'relative'
                        }
                    }}>

                    <PrimaryButton
                        text={translate('text.BUTTON_YES', 'Yes')}
                        onClick={handleSubmit}>

                        {submitting && (
                            <Spinner size={SpinnerSize.small}
                                styles={{
                                    circle: {
                                        borderColor: `${theme.palette.white} ${theme.palette.neutralTertiary} ${theme.palette.neutralTertiary}`
                                    }
                                }} />
                        )}

                    </PrimaryButton>

                    <DefaultButton
                        disabled={submitting}
                        text={translate('text.BUTTON_NO', 'No')}
                        onClick={handleDecline} />

                </Stack>
            </Stack>
        </Dialog>
    );
};
