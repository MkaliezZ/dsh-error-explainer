import { parseError } from './core.js'

export const name = 'error-explainer'
export const inject = ['commands']

export function apply(ctx: any): void {
  ctx.commands.register({
    name: 'explain-error',
    description: 'Parse a pasted stack trace into bounded frames (Python/Node/Rust/Java).',
    recordInput: false,
    async handler(invocation: any) {
      const raw = String(invocation.rawInput ?? '').trim()
      if (!raw) return { kind: 'error', text: 'usage: /explain-error <pasted stack trace>' }
      return { kind: 'success', text: JSON.stringify(parseError(raw), null, 2) }
    },
  })
}