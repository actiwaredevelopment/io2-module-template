module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'brace-style': ['error', '1tbs', {
            allowSingleLine: true
        }],
        'array-bracket-spacing': ['error', 'never'],
        'array-element-newline': ['error', {
            ArrayExpression: 'consistent',
            ArrayPattern: 'never'
        }],
        'block-spacing': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'comma-style': ['error', 'last'],
        'comma-spacing': ['error', {
            after: true
        }],
        'computed-property-spacing': ['error', 'never'],
        'consistent-this': ['error', 'that'],
        'eol-last': ['error', 'always'],
        'func-call-spacing': ['error', 'never'],
        'implicit-arrow-linebreak': ['error', 'beside'],
        indent: ['error', 4, {
            SwitchCase: 1
        }],
        'jsx-quotes': ['error', 'prefer-single'],
        'key-spacing': ['error'],
        'keyword-spacing': ['error'],
        'lines-around-comment': ['error', {
            beforeBlockComment: true
        }],
        'new-parens': ['error', 'always'],
        'newline-per-chained-call': ['error', {
            ignoreChainWithDepth: 2
        }],
        'no-lonely-if': ['error'],
        'no-multiple-empty-lines': ['error', {
            max: 2
        }],
        'no-trailing-spaces': ['error'],
        'no-unneeded-ternary': ['error'],
        'no-whitespace-before-property': ['error'],
        'nonblock-statement-body-position': ['error'],
        'object-curly-newline': ['error', {
            ObjectExpression: {
                minProperties: 1
            },
            ObjectPattern: {
                consistent: true
            },
            ImportDeclaration: {
                minProperties: 2
            },
            ExportDeclaration: {
                minProperties: 2
            }
        }],
        'object-curly-spacing': ['error', 'always'],
        'object-property-newline': ['error', {
            allowAllPropertiesOnSameLine: false
        }],
        'one-var': ['error', 'never'],
        'operator-assignment': ['error', 'always'],
        'operator-linebreak': ['error', 'before'],
        'prefer-exponentiation-operator': ['error'],
        'prefer-object-spread': ['error'],
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],
        semi: [
            'error',
            'always'
        ],
        'semi-spacing': ['error', {
            before: false,
            after: true
        }],
        'semi-style': ['error', 'last'],
        'sort-vars': ['error', {
            ignoreCase: true
        }],
        'space-before-blocks': ['error', 'always'],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'space-in-parens': ['error', 'never'],
        'space-infix-ops': ['error', {
            int32Hint: false
        }],
        'space-unary-ops': [2, {
            words: true,
            nonwords: false
        }],
        'spaced-comment': ['error', 'always', {
            markers: ['/']
        }],
        'switch-colon-spacing': ['error', {
            after: true,
            before: false
        }],
        'template-tag-spacing': ['error', 'never'],
        'unicode-bom': ['error', 'never'],
        'wrap-regex': ['error'],
        'padded-blocks': ['error', {
            blocks: 'never',
            classes: 'always',
            switches: 'never'
        }, {
            allowSingleLineBlocks: false
        }],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return'
            },
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var'],
                next: '*'
            },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var'],
                next: ['const', 'let', 'var']
            },
            {
                blankLine: 'always',
                prev: 'directive',
                next: '*'
            },
            {
                blankLine: 'any',
                prev: 'directive',
                next: 'directive'
            }
        ],
        'arrow-body-style': ['error', 'always'],
        'arrow-parens': ['error', 'always'],
        'arrow-spacing': ['error', {
            before: true,
            after: true
        }],
        'generator-star-spacing': ['error', {
            before: true,
            after: false
        }],
        'no-confusing-arrow': ['error'],
        'no-useless-computed-key': ['error'],
        'no-useless-rename': ['error'],
        'no-var': ['error'],
        'object-shorthand': ['error'],
        'prefer-arrow-callback': ['error'],
        'prefer-const': ['error'],
        'prefer-destructuring': ['error', {
            object: true,
            array: false
        }, {
            enforceForRenamedProperties: false
        }],
        'prefer-template': ['error'],
        'rest-spread-spacing': ['error', 'never'],
        'template-curly-spacing': ['error', 'never'],
        'yield-star-spacing': ['error', {
            before: true,
            after: false
        }],
        'no-undef-init': ['error'],
        yoda: ['error', 'never'],
        'no-useless-return': ['error'],
        'no-unused-labels': ['error'],
        'no-multi-spaces': ['error'],
        'no-floating-decimal': ['error'],
        'no-extra-bind': ['error'],
        'no-else-return': ['error'],
        eqeqeq: ['error'],
        'dot-notation': ['error'],
        'dot-location': ['error', 'property'],
        curly: ['error'],
        'no-extra-boolean-cast': ['error'],
        'no-extra-semi': ['error'],
        'no-regex-spaces': ['error'],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: true
                }
            }
        ]
    }
};
