import { Stack, TextField, ICommandBarItemProps, CommandBar } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

import { IDataQueryExampleQuery } from '../models';
import { DataQueryErrorType } from '../validation';

interface IDataQueryCommonSettingsProps {
    config: IDataQueryExampleQuery;
    errors: DataQueryErrorType;

    onChange: (config: IDataQueryExampleQuery) => void;
    onTest: (config: IDataQueryExampleQuery) => void;
}

export const DataQueryCommonSettings: React.FunctionComponent<IDataQueryCommonSettingsProps> = (props) => {
    const { t: translate } = useTranslation();

    const queryCommands: ICommandBarItemProps[] = [
        {
            disabled: !props.config.query,
            key: 'test-query',
            onClick: () => props.onTest(props.config),
            text: translate('text.BUTTON_TEST_QUERY', 'Test Query'),
            iconProps: {
                iconName: 'fa-play'
            }
        }
    ];

    function handleNameChange(_?: unknown, newValue?: string) {
        props.onChange({
            ...props.config,
            name: newValue ?? ''
        });
    }

    return (
        <Stack
            tokens={{
                childrenGap: '0.5rem'
            }}>
            <CommandBar
                items={queryCommands}
                styles={{
                    root: {
                        padding: 0
                    }
                }}
            />

            <TextField
                required
                autoFocus
                label={translate('text.LABEL_QUERY_NAME', 'How do you want to name the query?')}
                errorMessage={props.errors.name ?? ''}
                value={props.config.name ?? ''}
                onChange={handleNameChange}
                placeholder={translate(
                    'text.WATERMARK_ENTER_DATA_QUERY_NAME',
                    'Please enter a name for the data query'
                )}
            />
        </Stack>
    );
};
