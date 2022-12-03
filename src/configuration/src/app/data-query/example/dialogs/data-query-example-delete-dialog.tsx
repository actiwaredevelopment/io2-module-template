import { IDataQueryExampleSource } from '../models';
import {
    DefaultButton,
    Dialog,
    DialogFooter,
    getTheme,
    IDialogContentProps,
    IDialogContentStyles,
    IDialogProps,
    IStyle,
    mergeStyles,
    PrimaryButton,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const SUB_TEXT_STYLE: IStyle = {
    minHeight: '2rem'
};

export interface IDataQueryExampleDeleteDialogConfig {
    show?: boolean;
    items?: IDataQueryExampleSource[];
}

export interface IDataQueryExampleDeleteDialogProps extends IDataQueryExampleDeleteDialogConfig, IDialogProps {
    onSubmit?: (items?: IDataQueryExampleSource[]) => void;
}

export const DataQueryExampleDeleteDialog: React.FunctionComponent<IDataQueryExampleDeleteDialogProps> = (props) => {
    const { items } = props;

    const theme = getTheme();
    const { t: translate } = useTranslation();

    const [primaryInProgress, setPrimaryInProgress] = useState(false);
    const [secondaryInProgress, setSecondaryInProgress] = useState(false);

    let title: string | JSX.Element = '';
    let subText: string | JSX.Element = '';

    if (items && items?.length > 1) {
        title = translate('message.WINDOW_DELETE_MULTIPLE_QUERIES.caption', 'Delete queries?');
        subText = (
            <Trans
                t={translate}
                i18nKey={'message.WINDOW_DELETE_MULTIPLE_QUERIES.description'}
                defaults='<p>Do you really want to remove the selected queries and all its data queries?</p><p>Please note that the queries and its queries cannot be restored after removing the query and saving the settings.</p>'
            />
        );
    } else {
        title = translate('message.WINDOW_DELETE_SINGLE_QUERY.caption', 'Delete query?');
        subText = (
            <Trans
                t={translate}
                i18nKey={'message.WINDOW_DELETE_SINGLE_QUERY.description'}
                values={{
                    query: items?.[0].name ?? ''
                }}
                defaults='<p>Do you really want to remove the selected query <strong>{{query}}</strong> and all its data queries?</p><p>Please note that the query and its queries cannot be restored after removing the query and saving the settings.</p>'
            />
        );
    }

    const dialogContentProps: IDialogContentProps = {
        title,
        ...props.dialogContentProps,
        styles: {
            ...props.dialogContentProps?.styles,
            subText: mergeStyles(
                SUB_TEXT_STYLE,
                (props.dialogContentProps?.styles as IDialogContentStyles | undefined)?.subText
            )
        }
    };

    if (primaryInProgress) {
        dialogContentProps.showCloseButton = false;
    }

    function handleAfterDismiss() {
        setPrimaryInProgress(false);
        setSecondaryInProgress(false);

        // Chain callback
        props.modalProps?.onDismissed?.();
    }

    function handleDefaultButtonClick() {
        props.onDismiss?.();
    }

    async function handlePrimaryButtonClick() {
        if (primaryInProgress) {
            return;
        }

        setPrimaryInProgress(true);

        props.onSubmit?.(items ?? []);

        setPrimaryInProgress(false);
    }

    return (
        <Dialog
            minWidth={'24rem'}
            {...props}
            dialogContentProps={dialogContentProps}
            modalProps={{
                ...props.modalProps,
                onDismissed: handleAfterDismiss
            }}>
            {subText}
            <DialogFooter>
                <PrimaryButton
                    disabled={secondaryInProgress}
                    onClick={handlePrimaryButtonClick}
                    text={translate('text.BUTTON_DELETE', 'Delete')}>
                    {primaryInProgress && (
                        <Spinner
                            size={SpinnerSize.small}
                            styles={{
                                circle: {
                                    borderColor: `${theme.palette.white} ${theme.palette.neutralTertiary} ${theme.palette.neutralTertiary}`
                                }
                            }}
                        />
                    )}
                </PrimaryButton>

                <DefaultButton
                    onClick={handleDefaultButtonClick}
                    text={translate('text.BUTTON_CANCEL', 'Cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};

