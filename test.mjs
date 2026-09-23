import assert from 'node:assert/strict';
import { load, save, toggle, reset, remainingAt } from './timer.js';

const mem = new Map();
const storage = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };

let s = reset(load(storage), 60000);
assert.equal(remainingAt(s, 0), 60000);

s = toggle(s, 1000);                      // start
assert.equal(s.endAt, 61000);
assert.equal(remainingAt(s, 11000), 50000);

s = toggle(s, 11000);                     // pause
assert.equal(s.endAt, null);
assert.equal(s.remaining, 50000);

s = toggle(s, 20000);                     // resume, gap while paused ignored
assert.equal(remainingAt(s, 30000), 40000);
assert.equal(remainingAt(s, 999999), 0);  // clamps at zero

s = toggle(s, 999999);                    // pause at zero
assert.equal(toggle(s, 999999), s);       // cannot start from zero

s = reset(s);
assert.equal(s.remaining, 60000);

save({ ...s, remaining: -5 }, storage);
assert.equal(load(storage).remaining, 0); // load clamps
assert.equal(load(storage).chime, true);

console.log('ok');
