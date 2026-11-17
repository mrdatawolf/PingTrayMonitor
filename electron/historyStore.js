// Local history recorder for the desktop app. Watches the items the MQTT
// runtime already produces and appends status changes and new agent samples
// to daily JSONL files under <userData>/history (row format documented in
// src/lib/history.js). History therefore only covers time this app was
// running — lifecycle and broker-state rows let the History window show
// those gaps honestly instead of guessing.
import fs from 'fs';
import path from 'path';
import {
  TICK_MS, metaForItem, sampleSignature, buildHistory, extractSamples,
  computeBaselines, buildPatterns, BASELINE_RECENT_MS, BASELINE_NORMAL_MS,
} from '../src/lib/history.js';

const RETENTION_DAYS = 30;
const DAY_MS = 86_400_000;
const DAY_FILE_RE = /^(\d{4}-\d{2}-\d{2})\.jsonl$/;

function dayKey(t) {
  return new Date(t).toISOString().slice(0, 10); // UTC day
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function parseLines(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    if (!line) continue;
    try { rows.push(JSON.parse(line)); } catch { /* torn write — skip */ }
  }
  return rows;
}

function sameMeta(a, b) {
  return !!a && JSON.stringify(a) === JSON.stringify(b);
}

export function createHistoryStore(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const metaFile = path.join(dir, 'meta.json');
  let meta = readJson(metaFile) || {};
  let metaDirty = false;

  const last = new Map(); // topicKey → { s, sig } — last status/sample written
  let conn = null;
  let running = false;
  let currentDay = null;
  let tickTimer = null;
  let lastPruneDay = null;

  // Parsed rows of past (immutable) days, keyed by day.
  const dayCache = new Map();

  const fileFor = (day) => path.join(dir, `${day}.jsonl`);

  function appendRaw(day, rows) {
    try {
      fs.appendFileSync(fileFor(day), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
    } catch (err) {
      console.error('[History] Write failed:', err.message);
    }
  }

  // A day file must be readable on its own, so the first write into a new
  // day while running starts with the current state carried forward.
  function write(row) {
    const day = dayKey(row.t);
    if (day !== currentDay) {
      const isNew = !fs.existsSync(fileFor(day));
      currentDay = day;
      if (isNew && running) {
        const carry = [{ t: row.t, e: 'app', v: 'tick', ...(conn ? { cs: conn } : {}) }];
        if (conn) carry.push({ t: row.t, e: 'conn', v: conn });
        for (const [k, { s }] of last) carry.push({ t: row.t, k, s, c: 1 });
        appendRaw(day, carry);
      }
    }
    appendRaw(day, [row]);
  }

  function saveMeta() {
    if (!metaDirty) return;
    try {
      fs.writeFileSync(metaFile, JSON.stringify(meta));
      metaDirty = false;
    } catch (err) {
      console.error('[History] Meta write failed:', err.message);
    }
  }

  function prune(now) {
    const today = dayKey(now);
    if (lastPruneDay === today) return;
    lastPruneDay = today;
    const cutoff = dayKey(now - RETENTION_DAYS * DAY_MS);
    for (const name of fs.readdirSync(dir)) {
      const m = DAY_FILE_RE.exec(name);
      if (m && m[1] < cutoff) {
        try { fs.unlinkSync(path.join(dir, name)); } catch { /* ignore */ }
        dayCache.delete(m[1]);
      }
    }
  }

  async function readRange(from, to) {
    const today = dayKey(Date.now());
    const rows = [];
    for (let d = dayKey(from); d <= dayKey(to); d = dayKey(Date.parse(d) + DAY_MS)) {
      let dayRows = dayCache.get(d);
      if (!dayRows) {
        try {
          dayRows = parseLines(await fs.promises.readFile(fileFor(d), 'utf8'));
        } catch {
          dayRows = [];
        }
        if (d < today) dayCache.set(d, dayRows);
      }
      for (const r of dayRows) rows.push(r);
    }
    return rows;
  }

  function earliestDay() {
    const days = fs.readdirSync(dir).map((n) => DAY_FILE_RE.exec(n)?.[1]).filter(Boolean).sort();
    return days[0] || null;
  }

  return {
    start(connState) {
      const now = Date.now();
      running = true;
      write({ t: now, e: 'app', v: 'start' });
      conn = null;
      if (connState) this.connection(connState);
      prune(now);
      clearInterval(tickTimer);
      tickTimer = setInterval(() => this.tick(), TICK_MS);
    },

    stop() {
      if (!running) return;
      write({ t: Date.now(), e: 'app', v: 'stop' });
      running = false;
      clearInterval(tickTimer);
      tickTimer = null;
      saveMeta();
    },

    tick() {
      if (!running) return;
      const now = Date.now();
      write({ t: now, e: 'app', v: 'tick', ...(conn ? { cs: conn } : {}) });
      saveMeta();
      prune(now);
    },

    connection(state) {
      if (!running || state === conn) return;
      conn = state;
      write({ t: Date.now(), e: 'conn', v: state });
    },

    // Called with every items broadcast from the runtime.
    observe(itemsObj) {
      if (!running) return;
      const now = Date.now();
      for (const item of Object.values(itemsObj || {})) {
        const k = item.topicKey;
        const m = k && metaForItem(item);
        if (!m) continue;
        if (!sameMeta(meta[k], m)) { meta[k] = m; metaDirty = true; }

        const s = item.computedStatus;
        const sig = item.messageType === 'heartbeat' ? null : sampleSignature(item);
        const prev = last.get(k);
        const newSample = sig != null && sig !== prev?.sig;
        if (prev && prev.s === s && !newSample) continue;

        const row = { t: now, k, s };
        if (newSample) {
          const p = item.payload || {};
          if (typeof p.latencyMs === 'number') row.lat = p.latencyMs;
          if (typeof p.packetLoss === 'number') row.loss = p.packetLoss;
          if (typeof p.available === 'boolean') row.up = p.available ? 1 : 0;
          if (typeof p.transitions1h === 'number') row.tr = p.transitions1h;
        }
        write(row);
        last.set(k, { s, sig: sig ?? prev?.sig ?? null });
      }
    },

    // Items the user blocked: stop carrying their status forward.
    removed(topicKeys) {
      if (!running) return;
      const now = Date.now();
      for (const k of topicKeys) {
        if (!last.has(k)) continue;
        last.delete(k);
        write({ t: now, k, rm: 1 });
      }
    },

    async query({ rangeMs, hidden = [] }) {
      saveMeta();
      const now = Date.now();
      const from = now - rangeMs;
      const rows = await readRange(from, now);
      return {
        ...buildHistory(rows, meta, { from, to: now, now, hidden: new Set(hidden) }),
        recordingSince: earliestDay(),
        retentionDays: RETENTION_DAYS,
      };
    },

    async baselines() {
      const now = Date.now();
      const rows = await readRange(now - BASELINE_RECENT_MS - BASELINE_NORMAL_MS, now);
      return computeBaselines(rows, meta, now);
    },

    async patterns({ rangeMs }) {
      const now = Date.now();
      const from = now - rangeMs;
      const rows = await readRange(from, now);
      return { from, to: now, ...buildPatterns(rows, meta, from, now) };
    },

    async samples({ keys, from, to }) {
      const rows = await readRange(from, to);
      return extractSamples(rows, keys, from, to);
    },
  };
}
