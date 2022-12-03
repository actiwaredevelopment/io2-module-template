import { IDataQueryExampleQueryConfigSettingsProps } from '../dialogs/data-query-example-query-config-panel';

import { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { getTheme, Text, Stack } from '@fluentui/react';
import { HeadlineSettings } from '@actiwaredevelopment/io-sdk-react';

import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';

import Editor, { loader } from '@monaco-editor/react';
import { KeyCode, KeyMod } from 'monaco-editor';

loader.config({
    paths: {
        vs: `${process.env.PUBLIC_URL}/js/monaco-editor/vs`
    }
});

export const DataQueryExampleQueryStatement: React.FunctionComponent<IDataQueryExampleQueryConfigSettingsProps> = (
    props
) => {
    const { t: translate } = useTranslation();

    const editorRef = useRef(null);

    const theme = getTheme();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _editorOptions: any = {
        minimap: {
            enabled: false
        },
        dragAndDrop: false,
        formatOnPaste: true
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;

        editor.addAction({
            // An unique identifier of the contributed action.
            id: 'open-syntax-wizard',

            // A label of the action that will be presented to the user.
            label: translate('text.BUTTON_OPEN_SYNTAX_WIZARD', 'Open Syntax Wizard'),

            // An optional array of keybindings for the action.
            keybindings: [
                // chord
                KeyMod.chord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyO)
            ],

            // A precondition for this action.
            precondition: null,

            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: null,

            contextMenuGroupId: 'navigation',

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            run: function (ed: any) {
                DesignerAPI.system.openSyntaxWizard(
                    ed.getModel().getValueInRange(ed.getSelection()),
                    undefined,
                    (newValue) => {
                        const selection = ed.getSelection();
                        const id = { major: 1, minor: 1 };
                        const op = { identifier: id, range: selection, text: newValue, forceMoveMarkers: true };

                        ed.executeEdits('my-source', [op]);
                    }
                );
            }
        });
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
                verticalFill
                grow>
                <HeadlineSettings
                    headline={translate('text.TITLE_QUERY', 'Query')}
                    showHelp={true}
                    tooltipContent={''}
                    helpAddress='https://www.google.com'
                />

                {props.errors?.query?.length && (
                    <Text
                        variant='small'
                        style={{
                            paddingBottom: '0.3125rem',
                            color: theme.semanticColors.errorText
                        }}>
                        {props.errors?.query}
                    </Text>
                )}

                <Stack
                    verticalFill
                    styles={{
                        root: {
                            border: `1px solid ${theme.semanticColors.buttonBorder}`,
                            '--codelens-font-features_ee1f61': '"liga" off, "calt" off',
                            '--code-editorInlayHintsFontFamily': 'Menlo, Monaco, "Courier New", monospace'
                        }
                    }}>
                    <Editor
                        onMount={handleEditorDidMount}
                        className='editor'
                        theme='light'
                        language='graphql'
                        defaultLanguage='graphql'
                        options={_editorOptions}
                        value={props.config?.query ?? ''}
                        onChange={(value) => {
                            handleInputChange('query', value);
                        }}
                    />
                </Stack>
            </Stack>
        </Fragment>
    );
};

