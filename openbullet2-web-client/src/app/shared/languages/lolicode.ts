// biome-ignore lint/suspicious/noExplicitAny: any
export function registerLoliCode(monaco: any) {
  // Register a new language
  monaco.languages.register({ id: 'lolicode' });

  monaco.languages.setLanguageConfiguration('lolicode', {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      {
        open: '{',
        close: '}',
      },
      {
        open: '[',
        close: ']',
      },
      {
        open: '(',
        close: ')',
      },
      {
        open: "'",
        close: "'",
        notIn: ['string', 'comment'],
      },
      {
        open: '"',
        close: '"',
        notIn: ['string', 'comment'],
      },
    ],
    surroundingPairs: [
      {
        open: '{',
        close: '}',
      },
      {
        open: '[',
        close: ']',
      },
      {
        open: '(',
        close: ')',
      },
      {
        open: '<',
        close: '>',
      },
      {
        open: "'",
        close: "'",
      },
      {
        open: '"',
        close: '"',
      },
    ],
    folding: {
      markers: {
        start: /^\s*#region\b/,
        end: /^\s*#endregion\b/,
      },
    },
  });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('lolicode', {
    keywords: [
      'extern',
      'alias',
      'using',
      'bool',
      'decimal',
      'sbyte',
      'byte',
      'short',
      'ushort',
      'int',
      'uint',
      'long',
      'ulong',
      'char',
      'float',
      'double',
      'object',
      'dynamic',
      'string',
      'assembly',
      'is',
      'as',
      'ref',
      'out',
      'this',
      'base',
      'new',
      'typeof',
      'void',
      'checked',
      'unchecked',
      'default',
      'delegate',
      'var',
      'const',
      'if',
      'else',
      'switch',
      'case',
      'while',
      'do',
      'for',
      'foreach',
      'in',
      'break',
      'continue',
      'goto',
      'return',
      'throw',
      'try',
      'catch',
      'finally',
      'lock',
      'yield',
      'from',
      'let',
      'where',
      'join',
      'on',
      'equals',
      'into',
      'orderby',
      'ascending',
      'descending',
      'select',
      'group',
      'by',
      'namespace',
      'partial',
      'class',
      'field',
      'event',
      'method',
      'param',
      'property',
      'public',
      'protected',
      'internal',
      'private',
      'abstract',
      'sealed',
      'static',
      'struct',
      'readonly',
      'volatile',
      'virtual',
      'override',
      'params',
      'get',
      'set',
      'add',
      'remove',
      'operator',
      'true',
      'false',
      'implicit',
      'explicit',
      'interface',
      'enum',
      'null',
      'async',
      'await',
      'fixed',
      'sizeof',
      'stackalloc',
      'unsafe',
      'nameof',
      'when',
      'JUMP',
      'REPEAT',
      'END',
      'FOREACH',
      'IN',
      'LOG',
      'CLOG',
      'WHILE',
      'IF',
      'ELSE',
      'ELSE IF',
      'TRY',
      'CATCH',
      'LOCK',
      'SET',
      'TAKE',
      'TAKEONE',
      'FROM',
      'FINALLY',
      'ACQUIRELOCK',
      'RELEASELOCK',
      'MARK',
      'UNMARK',
      'USEPROXY',
      'PROXY',
    ], // Lolicode-specific
    namespaceFollows: ['namespace', 'using'],
    parenFollows: ['if', 'for', 'while', 'switch', 'foreach', 'using', 'catch', 'when'],
    operators: [
      '=',
      '??',
      '||',
      '&&',
      '|',
      '^',
      '&',
      '==',
      '!=',
      '<=',
      '>=',
      '<<',
      '+',
      '-',
      '*',
      '/',
      '%',
      '!',
      '~',
      '++',
      '--',
      '+=',
      '-=',
      '*=',
      '/=',
      '%=',
      '&=',
      '|=',
      '^=',
      '<<=',
      '>>=',
      '>>',
      '=>',
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    includeLF: true,
    tokenizer: {
      root: [
        // Jump to block section
        [/^[ \t]*BLOCK:.*/, 'block', '@block'],

        // Needed to not mess up syntax highlighting in some cases. There are still cases that are not handled.
        [
          /^[ \t]*(JUMP|REPEAT|END|FOREACH|LOG|CLOG|WHILE|IF|ELSE IF|ELSE|TRY|CATCH|LOCK|SET|TAKE(ONE)?|FINALLY|ACQUIRELOCK|RELEASELOCK|(UN)?MARK|MARK|(USE)?PROXY)/,
          'block',
          '@consumeline',
        ],
        [/#/, 'jumplabel', 'jumplabel'],

        [
          /\@?[a-zA-Z_]\w*/,
          {
            cases: {
              '@namespaceFollows': {
                token: 'keyword.$0',
                next: '@namespace',
              },
              '@keywords': {
                token: 'keyword.$0',
                next: '@qualified',
              },
              '@default': {
                token: 'identifier',
                next: '@qualified',
              },
            },
          },
        ],
        {
          include: '@whitespace',
        },
        [
          /}/,
          {
            cases: {
              '$S2==interpolatedstring': {
                token: 'string.quote',
                next: '@pop',
              },
              '$S2==litinterpstring': {
                token: 'string.quote',
                next: '@pop',
              },
              '@default': '@brackets',
            },
          },
        ],
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'delimiter',
              '@default': '',
            },
          },
        ],
        [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
        [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
        [/0[bB][01_]+/, 'number.hex'],
        [/[0-9_]+/, 'number'],
        [/[;,.]/, 'delimiter'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [
          /"/,
          {
            token: 'string.quote',
            next: '@string',
          },
        ],
        [
          /\$\@"/,
          {
            token: 'string.quote',
            next: '@litinterpstring',
          },
        ],
        [
          /\@"/,
          {
            token: 'string.quote',
            next: '@litstring',
          },
        ],
        [
          /\$"/,
          {
            token: 'string.quote',
            next: '@interpolatedstring',
          },
        ],
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid'],
      ],
      qualified: [
        [
          /[a-zA-Z_][\w]*/,
          {
            cases: {
              '@keywords': {
                token: 'keyword.$0',
              },
              '@default': 'identifier',
            },
          },
        ],
        [/\./, 'delimiter'],
        ['', '', '@pop'],
      ],
      namespace: [
        {
          include: '@whitespace',
        },
        [/[A-Z]\w*/, 'namespace'],
        [/[\.=]/, 'delimiter'],
        ['', '', '@pop'],
      ],
      comment: [
        [/[^\/*]+/, 'comment'],
        ['\\*/', 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],
      string: [
        [/[^\\"<]+/, 'string'], // Added '<' for Lolicode
        [/@escapes/, 'string.escape'],
        [/<[^>]+>/, 'string.variable'], // Lolicode specific
        [/\\./, 'string.escape.invalid'],
        [
          /"/,
          {
            token: 'string.quote',
            next: '@pop',
          },
        ],
      ],
      litstring: [
        [/[^"<]+/, 'string'], // Added '<' for Lolicode
        [/""/, 'string.escape'],
        [/<[^>]+>/, 'string.variable'], // Lolicode specific
        [
          /"/,
          {
            token: 'string.quote',
            next: '@pop',
          },
        ],
      ],
      litinterpstring: [
        [/[^"{<]+/, 'string'], // Added '<' for Lolicode
        [/""/, 'string.escape'],
        [/{{/, 'string.escape'],
        [/}}/, 'string.escape'],
        [/<[^>]+>/, 'string.variable'], // Lolicode specific
        [
          /{/,
          {
            token: 'string.quote',
            next: 'root.litinterpstring',
          },
        ],
        [
          /"/,
          {
            token: 'string.quote',
            next: '@pop',
          },
        ],
      ],
      interpolatedstring: [
        [/[^\\"{<]+/, 'string'], // Added '<' for Lolicode
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/{{/, 'string.escape'],
        [/}}/, 'string.escape'],
        [/<[^>]+>/, 'string.variable'], // Lolicode specific
        [
          /{/,
          {
            token: 'string.quote',
            next: 'root.interpolatedstring',
          },
        ],
        [
          /"/,
          {
            token: 'string.quote',
            next: '@pop',
          },
        ],
      ],
      whitespace: [
        [/^[ \t\v\f]*#((r)|(load))(?=\s)/, 'directive.csx'],
        [/^[ \t\v\f]*#\w.*$/, 'namespace.cpp'],
        [/[ \t\v\f\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*\n$/, 'comment'],
      ],
      block: [
        [/^[ \t]*ENDBLOCK\n$/, 'block.end', '@pop'],
        [/^[ \t]*DISABLED\n$/, 'block.disabled'],
        [/^[ \t]*SAFE\n$/, 'block.safe'],
        [/^[ \t]*LABEL:.*/, 'block.label'],
        [/\bVAR\b/, 'block.var'],
        [/\bCAP\b/, 'block.cap'],
        [/\$/, 'block.interp'],
        [/\@[A-Za-z0-9_\.]+/, 'block.variable'],
        [/\b=\>\b/, 'block.arrow'],
        [/KEYCHAIN SUCCESS (OR|AND)/, 'keychain.success'],
        [/KEYCHAIN FAIL (OR|AND)/, 'keychain.fail'],
        [/KEYCHAIN RETRY (OR|AND)/, 'keychain.retry'],
        [/KEYCHAIN BAN (OR|AND)/, 'keychain.ban'],
        [/KEYCHAIN NONE (OR|AND)/, 'keychain.none'],
        [/KEYCHAIN [A-Z]+ (OR|AND)/, 'keychain.default'],
        [/(INPUT|OUTPUT)/, 'script.output'],
        [/(BEGIN|END) SCRIPT/, 'script.delimiter'],
        [/RECURSIVE/, 'block.customparam'],
        [/(INTERPRETER|MODE|TYPE|CONTENT):[A-Za-z0-9]+/, 'block.customparam'],
        [/False/, 'false'],
        [/True/, 'true'],
        [/(INTKEY|STRINGKEY|BOOLKEY|FLOATKEY|LISTKEY|DICTKEY)/, 'key'],
        [
          /"/,
          {
            token: 'string.quote',
            next: '@string',
          },
        ],
        [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
        [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
        [/0[bB][01_]+/, 'number.hex'],
        [/[0-9_]+/, 'number'],
      ],
      consumeline: [
        [/\n/, 'none', '@pop'],
        [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
        [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
        [/0[bB][01_]+/, 'number.hex'],
        [/[0-9_]+/, 'number'],
        [/\$/, 'block.interp'],
        [/\b=\>\b/, 'block.arrow'],
        [/False/, 'false'],
        [/True/, 'true'],
        [/(INTKEY|STRINGKEY|BOOLKEY|FLOATKEY|LISTKEY|DICTKEY)/, 'key'],
        [/IN/, 'block'],
        [
          /"/,
          {
            token: 'string.quote',
            next: '@string',
          },
        ],
        [/#/, 'jumplabel', 'jumplabel'],
        [/\bVAR\b/, 'block.var'],
        [/\bCAP\b/, 'block.cap'],
        [/\$/, 'block.interp'],
        [/\@[A-Za-z0-9_\.]+/, 'block.variable'],
      ],
      jumplabel: [[/[A-Za-z0-9]*\n/, 'jumplabel', '@pop']],
    },
  });

  // Register the theme
  monaco.editor.defineTheme('vs-dark-lolicode', {
    base: 'vs-dark', // TODO: This could be manually set by the user
    inherit: true,
    colors: {},
    rules: [
      { token: 'block', foreground: '#98CFFF' },
      { token: 'block.end', foreground: '#98CFFF' },
      { token: 'block.disabled', foreground: '#EC7063' },
      { token: 'block.safe', foreground: '#BCFF70' },
      { token: 'block.label', foreground: '#58D68D' },
      { token: 'block.var', foreground: '#F7DC6F' },
      { token: 'block.cap', foreground: '#F1948A' },
      { token: 'block.arrow', foreground: '#BB8FCE' },
      { token: 'block.interp', foreground: '#BB8FCE' },
      { token: 'block.variable', foreground: '#FAD7A0' },
      { token: 'block.customparam', foreground: '#A8FFD2' },
      { token: 'string.variable', foreground: '#FAD7A0' },
      { token: 'jumplabel', foreground: '#F78686' },
      { token: 'key', foreground: '#6F81FF' },
      { token: 'false', foreground: '#FF6347' },
      { token: 'true', foreground: '#9ACD32' },
      { token: 'keychain.success', foreground: '#9ACD32' },
      { token: 'keychain.fail', foreground: '#FF6347' },
      { token: 'keychain.retry', foreground: '#FFFF00' },
      { token: 'keychain.ban', foreground: '#DDA0DD' },
      { token: 'keychain.none', foreground: '#87CEEB' },
      { token: 'keychain.default', foreground: '#FFA500' },
      { token: 'script.delimiter', foreground: '#6F81FF' },
      { token: 'script.output', foreground: '#FFBC80' },
    ],
  });

  monaco.languages.registerCompletionItemProvider('lolicode', {
    // biome-ignore lint/suspicious/noExplicitAny: any
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: word.endColumn,
      };

      const blockAutocompletions = autoCompleteBlock(monaco, range);
      const customAutocompletions = autoCompleteLoliCodeStatement(monaco, range);

      return {
        suggestions: blockAutocompletions.concat(customAutocompletions),
      };
    },
  });
}

// biome-ignore lint/suspicious/noExplicitAny: any
export function autoCompleteBlock(monaco: any, range: any) {
  const blockAutocompletions = [];
  for (const id in monaco.loliCodeBlockSnippets) {
    blockAutocompletions.push({
      label: `BLOCK:${id}`,
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: `BLOCK:${id}\n${monaco.loliCodeBlockSnippets[id]}ENDBLOCK\n`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    });
  }
  return blockAutocompletions;
}

// biome-ignore lint/suspicious/noExplicitAny: any
export function autoCompleteLoliCodeStatement(monaco: any, range: any) {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup
  const customAutocompletions = [
    {
      label: 'LOG (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'LOG ${1:"hello"}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'CLOG (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'CLOG ${1:YellowGreen} ${2:"hello"}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'JUMP (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'JUMP ${1:#HERE}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'REPEAT (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['REPEAT ${1:5}', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'FOREACH (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['FOREACH ${1:elem} IN ${2:list}', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'WHILE (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['WHILE ${1:STRINGKEY} ${2:@data.SOURCE} ${3:Contains} ${4:"hello"}', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'IF (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['IF ${1:STRINGKEY} ${2:@data.SOURCE} ${3:Contains} ${4:"hello"}', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'IF/ELSE (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['IF ${1:STRINGKEY} ${2:@data.SOURCE} ${3:Contains} ${4:"hello"}', '', 'ELSE', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'IF/ELSE IF/ELSE (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        'IF ${1:STRINGKEY} ${2:@data.SOURCE} ${3:Contains} ${4:"hello"}',
        '',
        'ELSE IF ${5:STRINGKEY} ${6:@data.SOURCE} ${7:Contains} ${8:"another"}',
        '',
        'ELSE',
        '',
        'END',
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'TRY/CATCH (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['TRY', '', 'CATCH', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'TRY/CATCH/FINALLY (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['TRY', '', 'CATCH', '', 'FINALLY', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'LOCK (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ['LOCK ${1:globals}', '', 'END'].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'ACQUIRELOCK/RELEASELOCK (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        'ACQUIRELOCK ${1:globals}',
        'TRY',
        '// Async code goes here',
        'FINALLY',
        'RELEASELOCK ${1:globals}',
        'END',
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'SET VAR (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'SET VAR ${1:name} ${2:"value"}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'SET CAP (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'SET CAP ${1:name} ${2:"value"}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'SET USEPROXY (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'SET USEPROXY ${1:value}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'SET PROXY (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'SET PROXY "${1:host}" ${2:port} ${3:type}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'SET PROXY (Auth) (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'SET PROXY "${1:host}" ${2:port} ${3:type} "${4:username}" "${5:password}"',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'MARK (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'MARK @${1:variable}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'UNMARK (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'UNMARK @${1:variable}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'SET PROXY (Auth) (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'SET PROXY "${1:host}" ${2:port} ${3:type} "${4:username}" "${5:password}"',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'TAKEONE (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'TAKEONE FROM ${1:"resourceName"} => ${2:@myString}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      label: 'TAKE (LoliCode)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'TAKE ${1:5} FROM ${2:"resourceName"} => ${3:@myList}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
  ];

  for (const id in monaco.loliCodeCustomSnippets) {
    customAutocompletions.push({
      label: id,
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: monaco.loliCodeCustomSnippets[id],
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    });
  }

  return customAutocompletions;
}
