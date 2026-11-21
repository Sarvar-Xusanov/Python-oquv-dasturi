import { useEffect, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { tags } from '@lezer/highlight';
import type { ThemeMode } from '../types/domain';

interface CodeEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  theme: ThemeMode;
  fontSize?: number;
  tabSize?: number;
  readOnly?: boolean;
  minHeight?: string;
  onRunShortcut?: () => void;
}

const darkHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#39C98A', fontWeight: '600' },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#F0F5F1' },
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#75E0AE' },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#E6B65C' },
  { tag: [tags.definition(tags.name), tags.separator], color: '#D6E4DC' },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#62A8E8' },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link], color: '#75E0AE' },
  { tag: [tags.meta, tags.comment], color: '#718178', fontStyle: 'italic' },
  { tag: tags.string, color: '#E6B65C' },
  { tag: tags.bool, color: '#62A8E8' },
  { tag: tags.invalid, color: '#EF6464' },
]);

const lightHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#0E7C51', fontWeight: '600' },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#0F1F18' },
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#128758' },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#B7791F' },
  { tag: [tags.typeName, tags.className, tags.number, tags.self, tags.namespace], color: '#1D5FA7' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#0E7C51' },
  { tag: [tags.meta, tags.comment], color: '#687D72', fontStyle: 'italic' },
  { tag: tags.string, color: '#9A6315' },
  { tag: tags.bool, color: '#1D5FA7' },
  { tag: tags.invalid, color: '#D94848' },
]);

function buildThemeExtension(theme: ThemeMode, fontSize: number, minHeight: string) {
  const isDark = theme === 'dark';
  return [
    EditorView.theme(
      {
        '&': {
          backgroundColor: isDark ? '#0D1613' : '#F8FBF9',
          color: isDark ? '#F0F5F1' : '#0F1F18',
          fontSize: `${fontSize}px`,
          minHeight,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        },
        '.cm-content': {
          caretColor: isDark ? '#39C98A' : '#128758',
          padding: '12px 0',
        },
        '.cm-gutters': {
          backgroundColor: isDark ? '#0B1110' : '#EEF5F0',
          color: isDark ? '#718178' : '#687D72',
          borderRight: `1px solid ${isDark ? '#263A30' : '#D5E2DA'}`,
          paddingRight: '6px',
        },
        '.cm-activeLineGutter': {
          backgroundColor: isDark ? '#14211C' : '#E2EDE6',
          color: isDark ? '#F0F5F1' : '#0F1F18',
        },
        '.cm-activeLine': {
          backgroundColor: isDark ? 'rgba(27, 44, 36, 0.45)' : 'rgba(18, 135, 88, 0.06)',
        },
        '&.cm-focused .cm-cursor': {
          borderLeftColor: isDark ? '#39C98A' : '#128758',
        },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
          backgroundColor: isDark ? 'rgba(22, 163, 106, 0.25)' : 'rgba(18, 135, 88, 0.18)',
        },
      },
      { dark: isDark },
    ),
    syntaxHighlighting(isDark ? darkHighlight : lightHighlight),
  ];
}

export function CodeEditor({
  value,
  onChange,
  theme,
  fontSize = 14,
  tabSize = 4,
  readOnly = false,
  minHeight = '320px',
  onRunShortcut,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  const indentCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRunShortcut);
  onChangeRef.current = onChange;
  onRunRef.current = onRunShortcut;

  useEffect(() => {
    if (!containerRef.current) return;

    const runShortcut = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          onRunRef.current?.();
          return true;
        },
      },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        highlightSelectionMatches(),
        python(),
        EditorState.readOnly.of(readOnly),
        indentCompartment.current.of([
          EditorState.tabSize.of(tabSize),
          indentUnit.of(' '.repeat(tabSize)),
        ]),
        themeCompartment.current.of(buildThemeExtension(theme, fontSize, minHeight)),
        runShortcut,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (value !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: [
        themeCompartment.current.reconfigure(buildThemeExtension(theme, fontSize, minHeight)),
        indentCompartment.current.reconfigure([
          EditorState.tabSize.of(tabSize),
          indentUnit.of(' '.repeat(tabSize)),
        ]),
      ],
    });
  }, [theme, fontSize, tabSize, minHeight]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)]"
    />
  );
}
