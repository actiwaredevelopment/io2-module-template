import { IDataQueryExampleQueryConfigSettingsProps } from '../dialogs/data-query-example-query-config-panel';

import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageBar, MessageBarType, Stack, TextField, ICommandBarItemProps, CommandBar } from '@fluentui/react';

export const DataQueryExampleQueryCommonSettings: React.FunctionComponent<IDataQueryExampleQueryConfigSettingsProps> = (
    props
) => {
    const { t: translate } = useTranslation();

    const queryCommands: ICommandBarItemProps[] = [
        {
            key: 'test-query',
            disabled: !props.config?.query?.length,
            text: translate('text.BUTTON_TEST_QUERY', 'Test Query'),
            iconProps: {
                iconName: 'fa-play'
            },
            onClick: () => {
                props.onTest?.(props.config);
            }
        }
    ];

    function handleInputChange(property?: string, newValue?: string | number) {
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
                <CommandBar
                    items={queryCommands}
                    styles={{
                        root: {
                            marginLeft: '0',
                            paddingLeft: '0'
                        }
                    }}
                />

                {props.errors?.warning_source?.length && (
                    <MessageBar
                        messageBarType={MessageBarType.warning}
                        isMultiline={true}
                        dismissButtonAriaLabel='Close'>
                        {props.errors?.warning_source}
                    </MessageBar>
                )}

                <TextField
                    required
                    autoFocus
                    label={translate('text.LABEL_QUERY_NAME', 'How do you want to name the query?')}
                    placeholder={translate(
                        'text.WATERMARK_ENTER_DATA_QUERY_NAME',
                        'Please enter a name for the data query'
                    )}
                    errorMessage={props.errors?.name ?? ''}
                    value={props.config?.name ?? ''}
                    onChange={(_, value) => handleInputChange('name', value ?? '')}
                />
            </Stack>
        </Fragment>
    );
};

