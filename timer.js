// Pure timer state. Wall-clock based: when running, remaining = endAt - now.
const KEY = 'timer';
const DEFAULT = { duration: 600000, endAt: null, remaining: 600000, chime: true, vibrate: true };

export function load(storage = globalThis.localStorage) {
  try {
    const s = { ...DEFAULT, ...JSON.parse(storage.getItem(KEY) || '{}') };
    s.remaining = Math.min(Math.max(s.remaining, 0), s.duration);
    return s;
  } catch { return { ...DEFAULT }; }
}

export function save(s, storage = globalThis.localStorage) {
  storage.setItem(KEY, JSON.stringify(s));
  return s;
}

export function remainingAt(s, now) {
  return s.endAt == null ? s.remaining : Math.max(0, s.endAt - now);
}

export function toggle(s, now) {
  if (s.endAt != null) return { ...s, endAt: null, remaining: remainingAt(s, now) };
  if (s.remaining <= 0) return s;
  return { ...s, endAt: now + s.remaining };
}

export function reset(s, duration = s.duration) {
  return { ...s, duration, endAt: null, remaining: duration };
}
