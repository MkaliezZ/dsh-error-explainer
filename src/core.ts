export type ErrorKind = 'python' | 'node' | 'rust' | 'java' | 'unknown';
export interface ErrorFrame { raw: string; file: string | undefined; line: number | null; }
export interface ParsedError { kind: ErrorKind; message: string; frames: ErrorFrame[]; }

export function detectErrorKind(text: string): ErrorKind {
  const source = String(text);
  if (/Traceback \(most recent call last\)/.test(source)) return 'python';
  if (/at .+\(.+:\d+:\d+\)/.test(source)) return 'node';
  if (/panicked at|thread '.+' panicked/.test(source)) return 'rust';
  if (/Exception in thread|\w+Exception:/.test(source)) return 'java';
  return 'unknown';
}

export function parseError(text: string): ParsedError {
  const source = String(text);
  const kind = detectErrorKind(source);
  const frames: ErrorFrame[] = [];
  const patterns = [
    /File "([^"]+)", line (\d+), in ([^\n]+)/g,
    /at\s+([^\s(]+)?\s*\(?([^():]+):(\d+):(\d+)\)?/g,
    /at\s+([^:\n]+):(\d+):(\d+)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      frames.push({
        raw: match[0],
        file: match[2] && kind === 'node' ? match[2] : match[1],
        line: Number(kind === 'node' ? match[3] : match[2]) || null,
      });
      if (frames.length >= 20) break;
    }
    if (frames.length) break;
  }
  const lines = source.trim().split('\n');
  return { kind, message: lines.at(-1) ?? '', frames };
}
