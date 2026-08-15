import test from 'node:test';
import assert from 'node:assert/strict';
import { parseError } from '../src/core.js';

test('parses python traceback', () => {
  const result = parseError('Traceback (most recent call last):\n  File "app.py", line 7, in main\nValueError: bad');
  assert.equal(result.kind, 'python');
  assert.equal(result.frames[0].file, 'app.py');
});

test('parses node stack', () => {
  const result = parseError('TypeError: bad\n    at run (/tmp/a.js:9:2)');
  assert.equal(result.kind, 'node');
  assert.equal(result.frames[0].line, 9);
});
