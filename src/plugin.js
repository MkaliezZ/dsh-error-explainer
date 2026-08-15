import {parseError} from './core.js'; export function registerErrorExplainer(ctx){ctx.command?.('explain-error',async(...parts)=>JSON.stringify(parseError(parts.join(' ')),null,2));}
