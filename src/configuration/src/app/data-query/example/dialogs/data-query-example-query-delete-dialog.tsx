import { IDataQueryExampleQuery } from '../models';
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

const SUB_TEXT_STYLE: IStyle = {
    minHeight: '2rem'
};

interface IDataQueryDeleteDialogProps extends IDialogProps {
    queries: IDataQueryExampleQuery[];

    onSubmit: (items: IDataQueryExampleQuery[]) => void;
}

export interface IDataQueryDeleteDialogConfig {
    queries: IDataQueryExampleQuery[];
    show: boolean;
}

export const DataQueryDeleteDialog: React.FunctionComponent<IDataQueryDeleteDialogProps> = (props) => {
    const { t: translate } = useTranslation();

    let title = '';
    let subText = <></>;

    if (props.queries.length > 1) {
        title = translate('message.WINDOW_DELETE_MULTIPLE_QUERIES.caption', 'Delete queries?');
        subText = (
            <Trans
                defaults='<p>Do you really want to remove the selected queries?</p><p>Please note that the queries cannot be restored after saving the settings.</p>'
                i18nKey={'message.WINDOW_DELETE_MULTIPLE_QUERIES.description'}
                t={translate}
            />
        );
    } else if (props.queries.length === 1) {
        title = translate('message.WINDOW_DELETE_SINGLE_QUERY.caption', 'Delete query?');
        subText = (
            <Trans
                t={translate}
                defaults='<p>Do you really want to remove the selected query <strong>{{query}}</strong>?</p><p>Please note that the queries cannot be restored after saving the settings.</p>'
                i18nKey={'message.WINDOW_DELETE_SINGLE_QUERY.description'}
                values={{
                    query: props.queries[0].name ?? ''
                }}
            />
        );
    }

    function handleDefaultButtonClick() {
        props.onDismiss?.();
    }

    function handlePrimaryButtonClick() {
        props.onSubmit(props.queries);
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
