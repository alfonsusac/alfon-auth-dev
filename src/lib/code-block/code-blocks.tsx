import { cn } from 'lazy-cn'
import { Fragment, type ReactNode } from 'react'
import {
  createHighlighter,
} from 'shiki'
import { monospaceLightTheme } from './theme-monospace-light'
import { CopyButton } from '../CopyButton'

export async function CodeBlock(props: {
  code: string
  language?: string
}) {
  // pre-process
  const rawcode = props.code.trim()
  const lang = props.language as any || 'tsx'

  let code: ReactNode = rawcode
  let background: string = ''
  try {
    const highlighter = await createHighlighter({
      themes: [monospaceLightTheme as any],
      langs: ['tsx'],
    })
    const tokens = highlighter.codeToTokens(rawcode, {
      lang: lang,
      theme: 'Monospace Light',
    })
    code = tokens.tokens.map((line, i) => <Fragment key={i}>
      {line.map((token, j) => <span key={j} style={{ color: token.color }}>{token.content}</span>)}
      {i < tokens.tokens.length - 1 ? <br /> : null}
    </Fragment>)
    background = tokens.bg || ''
    highlighter.dispose()
  } catch (error) {
    console.log("CodeBlock error:", error)
    code = rawcode
  }

  return (
    <pre className={cn(
      "p-3 py-2.5 sm:p-6 sm:py-5.5",
      "bg-foreground-body/5 text-xs overflow-auto rounded-md tracking-tight",
      "relative",
      "font-mono-2 font-medium",
      "group/codeblock",
    )}>
      {code}
      <CopyButton
        className="button small absolute top-2 right-2 opacity-0 group-hover/codeblock:opacity-100"
        text={rawcode}
      ></CopyButton>
      <span className="absolute bottom-2 right-2 text-xxs text-foreground/25 select-none">{lang}</span>
    </pre>
  )
}
