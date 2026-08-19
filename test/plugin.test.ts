import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../src/plugin.js'

type Handler = (invocation: { rawInput?: string }) => Promise<{ kind: string; text: string }>

function capture() {
  const commands: Record<string, Handler> = {}
  apply({ commands: { register: (d: { name: string; handler: Handler }) => { commands[d.name] = d.handler } } } as never)
  return commands
}

test('explain-error parses a python traceback', async () => {
  const result = await capture()['explain-error']!({ rawInput: 'Traceback (most recent call last):\n  File "a.py", line 3, in f\nValueError: boom' })
  assert.equal(result.kind, 'success')
  const parsed = JSON.parse(result.text)
  assert.equal(parsed.kind, 'python')
  assert.equal(parsed.frames.length, 1)
  assert.equal(parsed.frames[0].file, 'a.py')
})

test('explain-error rejects empty input', async () => {
  const result = await capture()['explain-error']!({ rawInput: '  ' })
  assert.equal(result.kind, 'error')
})
