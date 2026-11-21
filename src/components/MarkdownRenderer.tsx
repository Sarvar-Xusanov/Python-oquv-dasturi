import { useState } from 'react';
import { Check, Copy, Play } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  onLoadCode?: (code: string) => void;
  loadLabel?: string;
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded bg-[var(--pm-code-bg)] px-1.5 py-0.5 font-mono text-[0.875em] text-[var(--pm-accent)] border border-[var(--pm-border)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[var(--pm-text)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function CodeBlock({
  code,
  lang,
  onLoadCode,
  loadLabel,
}: {
  code: string;
  lang: string;
  onLoadCode?: (code: string) => void;
  loadLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-3 py-1.5 text-xs text-[var(--pm-text-muted)]">
        <span className="font-mono">{lang || 'python'}</span>
        <div className="flex items-center gap-2">
          {onLoadCode && (
            <button
              type="button"
              onClick={() => onLoadCode(code)}
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-[var(--pm-secondary)] hover:bg-[var(--pm-card-hover)] transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="h-3 w-3" />
              {loadLabel || 'Code Lab'}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? <Check className="h-3 w-3 text-[var(--pm-success)]" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-[13px] leading-relaxed text-[var(--pm-text)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, onLoadCode, loadLabel }: MarkdownRendererProps) {
  const segments = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-[var(--pm-text-secondary)]">
      {segments.map((segment, segIdx) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const lines = segment.slice(3, -3).split('\n');
          const lang = lines[0]?.trim() || 'python';
          const code = lines.slice(1).join('\n').trim();
          return (
            <CodeBlock
              key={segIdx}
              code={code}
              lang={lang}
              onLoadCode={onLoadCode}
              loadLabel={loadLabel}
            />
          );
        }

        const blocks = segment.split(/\n{2,}/);
        return blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={`${segIdx}-${bIdx}`} className="pt-2 text-base font-semibold text-[var(--pm-text)]">
                {renderInline(trimmed.slice(4))}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={`${segIdx}-${bIdx}`} className="pt-2 text-lg font-semibold text-[var(--pm-text)]">
                {renderInline(trimmed.slice(3))}
              </h3>
            );
          }

          const lines = trimmed.split('\n');
          const isList = lines.every((l) => /^(\s*[-*]|\s*\d+\.)\s+/.test(l));
          if (isList) {
            return (
              <ul key={`${segIdx}-${bIdx}`} className="space-y-1.5 pl-5 list-disc">
                {lines.map((line, lIdx) => (
                  <li key={lIdx}>{renderInline(line.replace(/^(\s*[-*]|\s*\d+\.)\s+/, ''))}</li>
                ))}
              </ul>
            );
          }

          return (
            <p key={`${segIdx}-${bIdx}`} className="whitespace-pre-line">
              {renderInline(trimmed)}
            </p>
          );
        });
      })}
    </div>
  );
}
