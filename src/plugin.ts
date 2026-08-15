import { parseError } from './core.js';

interface CommandContext {
  command?: (name: string, handler: (...args: string[]) => unknown | Promise<unknown>) => unknown;
}

export function registerErrorExplainer(ctx: CommandContext): void {
  ctx.command?.('explain-error', async (...parts) => JSON.stringify(parseError(parts.join(' ')), null, 2));
}
