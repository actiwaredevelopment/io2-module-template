import * as DesignerAPI from '@actiwaredevelopment/io-sdk-typescript-designer';
import { Text, Stack, useTheme, Label, StackItem } from '@fluentui/react';
import Editor, { loader } from '@monaco-editor/react';
import { KeyCode, KeyMod, editor } from 'monaco-editor';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { IDataQueryExampleQuery } from '../models';
import { DataQueryErrorType } from '../validation';

loader.config({
    paths: {
        vs: `${process.env.PUBLIC_URL}/js/monaco-editor/vs`
    }
});

type InputChangeType = keyof Pick<IDataQueryExampleQuery, 'query'>;

interface IDataQueryStatementProps {
    config: IDataQueryExampleQuery;
    errors: DataQueryErrorType;

    onChange: (config: IDataQueryExampleQuery) => void;
}

export const DataQueryStatement: React.FunctionComponent<IDataQueryStatementProps> = (props) => {
    const { t: translate } = useTranslation();
    const theme = useTheme();

    const editorRef = useRef<editor.IEditor>();

    const editorOptions: editor.IStandaloneEditorConstructionOptions = {
        dragAndDrop: false,
        formatOnPaste: true,
        minimap: {
            enabled: false
        }
    };

    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;

        editor.addAction({
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            id: 'open-syntax-wizard',
            label: translate('text.BUTTON_OPEN_SYNTAX_WIZARD', 'Open Syntax Wizard'),
            keybindings: [KeyMod.chord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyO)],
            run: (ed: editor.ICodeEditor) => {
                const selection = ed.getSelection();
                const endColumn = selection?.endColumn ?? 0;
                const endLineNumber = selection?.endLineNumber ?? 0;
                const startColumn = selection?.startColumn ?? 0;
                const startLineNumber = selection?.startLineNumber ?? 0;
                const selectedvalue =
                    ed.getModel()?.getValueInRange({
                        endColumn,
                        startColumn,
                        startLineNumber,
                        endLineNumber
                    }) ?? '';

                DesignerAPI.system.openSyntaxWizard(selectedvalue, undefined, (newValue) => {
                    const selection = ed.getSelection();
                    const endColumn = selection?.endColumn ?? 0;
                    const endLineNumber = selection?.endLineNumber ?? 0;
                    const startColumn = selection?.startColumn ?? 0;
                    const startLineNumber = selection?.startLineNumber ?? 0;
                    const op: editor.IIdentifiedSingleEditOperation = {
                        text: newValue,
                        forceMoveMarkers: true,
                        range: {
                            endColumn,
                            startColumn,
                            startLineNumber,
                            endLineNumber
                        }
                    };

                    ed.executeEdits('my-source', [op]);
                });
            }
        });
    }

    function handleInputChange(property: InputChangeType, newValue?: string) {
        props.onChange({
            ...props.config,
            [property]: newValue ?? ''
        });
    }

    return (
        <Stack verticalFill>
            <Label required>{translate('text.LABEL_ENTER_QUERY', 'You can enter your query here')}</Label>

            {props.errors.query && (
                <Text
                    variant='small'
                    style={{
                        color: theme.semanticColors.errorText,
                        padding: '0 0 1rem 0'
                    }}>
                    {props.errors.query}
                </Text>
            )}

            <StackItem
                grow
                styles={{
                    root: {
                        outline: `1px solid ${theme.semanticColors.inputBorder}`,
                        '&:focus-within': {
                            outline: `2px solid ${theme.palette.themePrimary}`,
                            borderRadius: 2
                        }
                    }
                }}>
                <Editor
                    className='editor'
                    defaultLanguage='sql'
                    language='sql'
                    onChange={(value) => handleInputChange('query', value)}
                    onMount={handleEditorDidMount}
                    options={editorOptions}
                    theme='light'
                    value={props.config.query ?? ''}
                />
            </StackItem>
        </Stack>
    );
};
