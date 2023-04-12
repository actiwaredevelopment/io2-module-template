import {
    DefaultButton,
    Dialog,
    DialogFooter,
    IDialogContentStyles,
    IDialogProps,
    IStyle,
    mergeStyles,
    PrimaryButton
} from '@fluentui/react';
import { Trans, useTranslation } from 'react-i18next';

import { IDataQueryExampleSource } from '../models';

const SUB_TEXT_STYLE: IStyle = {
    minHeight: '2rem'
};

interface IDataQuerySourceDeleteDialogProps extends IDialogProps {
    sources: IDataQueryExampleSource[];

    onSubmit: (sources: IDataQueryExampleSource[]) => void;
}

export interface IDataQuerySourceDeleteDialogConfig {
    show: boolean;
    sources: IDataQueryExampleSource[];
}

export const DataQuerySourceDeleteDialog: React.FunctionComponent<IDataQuerySourceDeleteDialogProps> = (props) => {
    const { t: translate } = useTranslation();

    let title = '';
    let subText = <></>;

    if (props.sources.length > 1) {
        title = translate('message.WINDOW_DELETE_MULTIPLE_SOURCES.caption', 'Delete sources?');
        subText = (
            <Trans
                defaults='<p>Do you really want to remove the selected source and all its data queries?</p><p>Please note that the source and its queries cannot be restored after removing and saving the settings.</p>'
                i18nKey={'message.WINDOW_DELETE_MULTIPLE_SOURCES.description'}
                t={translate}
            />
        );
    } else if (props.sources.length === 1) {
        title = translate('message.WINDOW_DELETE_SINGLE_SOURCE.caption', 'Delete source?');
        subText = (
            <Trans
                defaults='<p>Do you really want to remove the selected source <strong>{{source}}</strong> and all its data queries?</p><p>Please note that the source and its queries cannot be restored after removing and saving the settings.</p>'
                i18nKey={'message.WINDOW_DELETE_SINGLE_SOURCE.description'}
                t={translate}
                values={{
                    source: props.sources[0].name ?? ''
                }}
            />
        );
    }

    function handleDefaultButtonClick() {
        props.onDismiss?.();
    }

    function handlePrimaryButtonClick() {
        props.onSubmit(props.sources);
    }

    return (
        <Dialog
            minWidth={'24rem'}
            {...props}
            dialogContentProps={{
                title,
                ...props.dialogContentProps,
                styles: {
                    ...props.dialogContentProps?.styles,
                    subText: mergeStyles(
                        SUB_TEXT_STYLE,
                        (props.dialogContentProps?.styles as IDialogContentStyles | undefined)?.subText
                    )
                }
            }}>
            {subText}

            <DialogFooter>
                <PrimaryButton
                    onClick={handlePrimaryButtonClick}
                    text={translate('text.BUTTON_DELETE', 'Delete')}
                />

                <DefaultButton
                    onClick={handleDefaultButtonClick}
                    text={translate('text.BUTTON_CANCEL', 'Cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};
