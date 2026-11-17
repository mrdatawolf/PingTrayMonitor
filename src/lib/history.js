// History helpers shared by the Electron recorder (electron/historyStore.js)
// and the History window (src/components/HistoryApp.js). Pure functions, no
// Node or DOM dependencies.
//
// Storage model (one JSON object per line, daily files):
//   { t, e: 'app',  v: 'start' | 'stop' | 'tick', cs? } recorder lifecycle;
//                                                    ticks carry the broker
//                                                    state as `cs`
//   { t, e: 'conn', v: 'live' | 'grey' | 'black' }    broker connection state
//   { t, k, s, lat?, loss?, up?, tr?, c? }             item status / sample
//                                                    (tr = agent's transitions1h)
//   { t, k, rm: 1 }                                    item removed by the user
// `t` is epoch ms, `k` the topicKey, `s` the runtime's computedStatus. `c: 1`
// marks a carried-forward status written at the top of a new day file.
//
// History only exists for time the desktop app was running AND connected to
// the broker ("coverage"); everything else is unknown, never assumed green.
//
// Statuses in the built history mirror the tray's rules (connectionStatus.js
// withOriginStatus / computeServers):
//   green / yellow / red — as reported
//   silent — the server that publishes this item had a stale heartbeat, so
//            its last word can't be trusted; never counted as downtime.
//            For a server's own row: heartbeat stale but its site still
//            answered pings (or no reachability data) — monitoring stopped.
//   red (server row) — heartbeat stale AND the site was unreachable.
//   grey — known item, unknown state

import { originKeyForTopic } from './connectionStatus';

export const TICK_MS = 5 * 60_000;
// Longer than this between recorder ticks means the app crashed or the
// machine slept without a clean stop — coverage ends one tick after the last.
const GAP_MS = 2.5 * TICK_MS;

// Identifies a distinct report from an agent, so retained re-deliveries on
// reconnect aren't recorded as new samples.
export function sampleSignature(item) {
  const p = item.payload || {};
  return p.checkedAt || p.publishedAt || p.lastReceived || null;
}

// How an item is labeled and grouped in the History window. Stored alongside
// the rows (meta.json) so history stays readable after an item disappears.
export function metaForItem(item) {
  const p = item.payload || {};
  const id = p.id || String(item.topicKey).split('/').pop();
  switch (item.messageType) {
    case 'connections_status':
      return {
        type: 'connections_status', label: p.label || id, checkType: p.type || null,
        groupId: `subject:${p.subjectId}`, groupLabel: p.subjectLabel || p.subjectId, subjectId: p.subjectId,
      };
    case 'connection_status':
      return {
        type: 'connection_status', label: p.label || id, checkType: p.type || null,
        groupId: `source:${item.sourceLabel}`, groupLabel: item.sourceLabel,
      };
    case 'process_status':
      return { type: 'process_status', label: item.sourceLabel, checkType: null, groupId: 'processes', groupLabel: 'Processes' };
    case 'heartbeat':
      return {
        type: 'heartbeat', label: item.sourceLabel, checkType: null, groupId: 'servers', groupLabel: 'Reporting servers',
        // Subjects that ping this server's site — tells "server silent but
        // site up" (monitoring stopped) from "site unreachable".
        reach: [...new Set([...(item.reachabilitySubjects || []), ...(p.siteSubjectIds || [])])].sort(),
      };
    default:
      return null;
  }
}

const NETWORK_CHECK_TYPES = new Set(['icmp', 'tcp']);

// Network reachability checks (pings / port checks) — the ones the
// Sources, Performance and Patterns views are about. Multi-location
// "connections" are always network checks.
export function isNetworkMeta(m) {
  if (!m) return false;
  if (m.type === 'connections_status') return true;
  return m.type === 'connection_status' && NETWORK_CHECK_TYPES.has(m.checkType);
}

// Collapses the runtime's status vocabularies to green/yellow/red/grey,
// keeping a heartbeat's 'stale' for buildHistory to resolve.
export function normalizeStatus(s) {
  if (s === 'alive') return 'green';
  if (s === 'stale') return 'stale';
  if (s === 'green' || s === 'yellow' || s === 'red') return s;
  return 'grey';
}

// Combines several step functions ([{t, s}] sorted, value holds until the
// next event) into one: fn(...currentValues) at every change point, with
// repeats dropped. Values before a list's first event are null.
export function combineSteps(lists, fn) {
  const times = [...new Set(lists.flatMap((l) => l.map((e) => e.t)))].sort((a, b) => a - b);
  const idx = lists.map(() => 0);
  const cur = lists.map(() => null);
  const out = [];
  for (const t of times) {
    lists.forEach((l, li) => {
      while (idx[li] < l.length && l[idx[li]].t <= t) { cur[li] = l[idx[li]].s; idx[li]++; }
    });
    const s = fn(...cur);
    if (!out.length || out[out.length - 1].s !== s) out.push({ t, s });
  }
  return out;
}

// Intervals [a, b] when the recorder was running and the broker was live.
export function buildCoverage(rows, from, to, now) {
  const raw = [];
  let running = false;
  let conn = null;
  let lastAppT = null;
  let openAt = null;

  const close = (t) => {
    if (openAt != null) { raw.push([openAt, t]); openAt = null; }
  };

  for (const r of rows) {
    if (r.e !== 'app' && r.e !== 'conn') continue;
    if (running && lastAppT != null && r.t - lastAppT > GAP_MS) {
      close(lastAppT + TICK_MS);
      running = false;
      conn = null;
    }
    if (r.e === 'app') {
      if (r.v === 'stop') {
        close(r.t);
        running = false;
        conn = null;
      } else {
        if (r.v === 'start') { close(r.t); conn = null; }
        running = true;
        lastAppT = r.t;
        // Ticks restate the broker state, so coverage recovers after a
        // crash/sleep gap without waiting for the next state change.
        if (r.cs) conn = r.cs;
      }
    } else {
      conn = r.v;
      if (conn !== 'live') close(r.t);
    }
    if (openAt == null && running && conn === 'live') openAt = r.t;
  }
  if (openAt != null) {
    close(now - lastAppT <= GAP_MS ? now : lastAppT + TICK_MS);
  }

  const out = [];
  for (const [a, b] of raw) {
    const ca = Math.max(a, from);
    const cb = Math.min(b, to);
    if (cb > ca) out.push([ca, cb]);
  }
  return out;
}

// Splits one item's status changes into colored segments, clipped to the
// coverage intervals. Adjacent same-status segments are merged.
function buildSegments(events, coverage) {
  const segs = [];
  let i = 0;
  let status = null;
  for (const [a, b] of coverage) {
    while (i < events.length && events[i].t <= a) { status = events[i].s; i++; }
    let cursor = a;
    let cur = status;
    while (i < events.length && events[i].t < b) {
      const ev = events[i];
      if (cur && ev.t > cursor) segs.push({ a: cursor, b: ev.t, s: cur, covA: a, covB: b });
      if (ev.t > cursor) cursor = ev.t;
      cur = ev.s;
      i++;
    }
    if (cur && b > cursor) segs.push({ a: cursor, b, s: cur, covA: a, covB: b });
    status = cur;
  }

  const merged = [];
  for (const seg of segs) {
    const prev = merged[merged.length - 1];
    if (prev && prev.s === seg.s && prev.b === seg.a) prev.b = seg.b;
    else merged.push({ ...seg });
  }
  return merged;
}

// kinds: status → incident kind, e.g. { red: 'down', silent: 'silent' }.
function incidentsFromSegments(segments, from, to, now, kinds = { red: 'down' }) {
  const live = to >= now - 1000;
  return segments
    .filter((seg) => kinds[seg.s])
    .map((seg) => {
      const ongoing = live && seg.b >= to - 1000;
      return {
        kind: kinds[seg.s],
        start: seg.a,
        end: ongoing ? null : seg.b,
        ongoing,
        // Already down when recording began (or before the range): the true
        // start is earlier than shown.
        cutStart: seg.a === seg.covA,
        // Recording stopped while still down: the true end is later.
        cutEnd: !ongoing && seg.b === seg.covB,
      };
    });
}

// Clusters overlapping incidents of one multi-location subject, so "every
// location lost the circuit" (a real outage) reads differently from "one
// location lost it" (a path issue at that site).
function clusterSubjectIncidents(groupSeries, now) {
  const all = [];
  for (const s of groupSeries) {
    for (const inc of s.incidents) if (inc.kind === 'down') all.push({ ...inc, key: s.key, label: s.label });
  }
  all.sort((x, y) => x.start - y.start);
  const clusters = [];
  for (const inc of all) {
    const end = inc.end ?? now;
    const c = clusters[clusters.length - 1];
    if (c && inc.start <= c._end) {
      c._end = Math.max(c._end, end);
      c.parts.push(inc);
    } else {
      clusters.push({ _end: end, start: inc.start, parts: [inc] });
    }
  }
  return clusters.map((c) => {
    const ongoing = c.parts.some((p) => p.ongoing);
    return {
      kind: 'down',
      start: c.start,
      end: ongoing ? null : c._end,
      ongoing,
      cutStart: c.parts[0].cutStart,
      cutEnd: !ongoing && c.parts.some((p) => p.cutEnd && (p.end ?? now) === c._end),
      keys: [...new Set(c.parts.map((p) => p.key))],
      locations: [...new Set(c.parts.map((p) => p.label))],
    };
  });
}

// Builds everything the History window shows for [from, to].
//   rows   — all stored rows for the days covering [from, to] (any order)
//   meta   — topicKey → metaForItem(...)
//   hidden — topicKeys to leave out (e.g. currently blocked items)
export function buildHistory(rows, meta, { from, to, now, hidden = new Set() }) {
  const sorted = [...rows].sort((x, y) => x.t - y.t);
  const coverage = buildCoverage(sorted, from, to, now);
  const coveredMs = coverage.reduce((sum, [a, b]) => sum + (b - a), 0);

  const eventsByKey = new Map();
  const hasMetrics = new Set();
  for (const r of sorted) {
    if (!r.k || r.t > to) continue;
    if (!eventsByKey.has(r.k)) eventsByKey.set(r.k, []);
    eventsByKey.get(r.k).push({ t: r.t, s: r.rm ? null : normalizeStatus(r.s) });
    if (r.t >= from && (r.lat != null || r.loss != null)) hasMetrics.add(r.k);
  }

  // 1. Items from a server whose heartbeat was stale → 'silent'.
  const hbByOrigin = new Map();
  for (const [key, events] of eventsByKey) {
    if (meta[key]?.type === 'heartbeat') hbByOrigin.set(originKeyForTopic(key), events);
  }
  const effective = new Map();
  for (const [key, events] of eventsByKey) {
    const m = meta[key];
    if (!m || m.type === 'heartbeat') continue;
    const hb = hbByOrigin.get(originKeyForTopic(key));
    effective.set(key, hb
      ? combineSteps([events, hb], (s, h) => (s && h === 'stale' ? 'silent' : s))
      : events);
  }

  // 2. A server's stale heartbeat is red only if its site was unreachable
  //    from everywhere else (no live location saw any of its reachability
  //    subjects up); otherwise it's 'silent'.
  for (const [key, events] of eventsByKey) {
    const m = meta[key];
    if (m?.type !== 'heartbeat') continue;
    const reach = new Set(m.reach || []);
    const locLists = [...effective.entries()]
      .filter(([k]) => meta[k].type === 'connections_status'
        && reach.has(meta[k].subjectId ?? String(meta[k].groupId).replace(/^subject:/, '')))
      .map(([, ev]) => ev);
    const reachable = locLists.length
      ? combineSteps(locLists, (...vals) => {
        const known = vals.filter((v) => v && v !== 'silent' && v !== 'grey');
        if (!known.length) return null;
        return known.some((v) => v !== 'red') ? 'up' : 'down';
      })
      : [];
    effective.set(key, combineSteps([events, reachable], (h, r) => {
      if (!h) return null;
      if (h !== 'stale') return h;
      return r === 'down' ? 'red' : 'silent';
    }));
  }

  const series = [];
  for (const [key, events] of effective) {
    if (hidden.has(key)) continue;
    const m = meta[key];
    const segments = buildSegments(events, coverage);
    if (!segments.length) continue;
    const ms = { green: 0, yellow: 0, red: 0, grey: 0, silent: 0 };
    for (const seg of segments) ms[seg.s] += seg.b - seg.a;
    const knownMs = ms.green + ms.yellow + ms.red;
    series.push({
      key,
      ...m,
      origin: originKeyForTopic(key),
      segments: segments.map(({ a, b, s }) => ({ a, b, s })),
      ms,
      uptimePct: knownMs ? ((knownMs - ms.red) / knownMs) * 100 : null,
      incidents: incidentsFromSegments(segments, from, to, now,
        m.type === 'heartbeat' ? { red: 'down', silent: 'silent' } : { red: 'down' }),
      hasMetrics: hasMetrics.has(key),
      lastStatus: segments[segments.length - 1].s,
    });
  }

  const GROUP_ORDER = { connections_status: 0, connection_status: 1, process_status: 2, heartbeat: 3 };
  series.sort((x, y) =>
    (GROUP_ORDER[x.type] - GROUP_ORDER[y.type])
    || String(x.groupLabel).localeCompare(String(y.groupLabel))
    || String(x.label).localeCompare(String(y.label)));

  const groups = [];
  for (const s of series) {
    let g = groups[groups.length - 1];
    if (!g || g.id !== s.groupId) {
      g = { id: s.groupId, label: s.groupLabel, type: s.type, series: [] };
      groups.push(g);
    }
    g.series.push(s);
  }

  const incidents = [];
  for (const g of groups) {
    if (g.type === 'connections_status') {
      for (const c of clusterSubjectIncidents(g.series, now)) {
        incidents.push({
          ...c,
          groupLabel: g.label,
          type: g.type,
          totalLocations: g.series.length,
          label: c.locations.length === g.series.length && g.series.length > 1
            ? 'All locations'
            : c.locations.join(', '),
        });
      }
    } else {
      for (const s of g.series) {
        for (const inc of s.incidents) {
          incidents.push({ ...inc, groupLabel: g.label, type: g.type, keys: [s.key], locations: [s.label], label: s.label });
        }
      }
    }
  }
  incidents.sort((x, y) => y.start - x.start);

  return {
    from, to, now, coverage, coveredMs, groups, incidents,
    origins: buildOrigins(series, meta, coverage, from, to, now),
  };
}

// Segments → step events (null between segments), for combineSteps.
function segmentsToEvents(segments) {
  const out = [];
  for (const seg of segments) {
    out.push({ t: seg.a, s: seg.s });
    out.push({ t: seg.b, s: null });
  }
  return out;
}

// Groups network checks by the server that runs them ("origin"). When most
// of one server's checks fail at the same moment — across different
// targets — the likely culprit is that server's own uplink, not the
// targets. `summary` is that combined view:
//   red    — at least 2 checks and more than half of them down
//   yellow — some (but not most) of its checks down
//   green  — all of its checks up
function buildOrigins(series, meta, coverage, from, to, now) {
  const labels = new Map();
  for (const [key, m] of Object.entries(meta)) {
    if (m.type === 'heartbeat') labels.set(originKeyForTopic(key), m.label);
  }
  const byOrigin = new Map();
  for (const s of series) {
    if (!s.origin) continue;
    if (!byOrigin.has(s.origin)) byOrigin.set(s.origin, { checks: [], heartbeatKey: null });
    const o = byOrigin.get(s.origin);
    if (s.type === 'heartbeat') o.heartbeatKey = s.key;
    else if (isNetworkMeta(s)) o.checks.push(s);
  }

  const out = [];
  for (const [origin, o] of byOrigin) {
    if (!o.checks.length) continue;
    let summary = null;
    if (o.checks.length >= 2) {
      const events = combineSteps(o.checks.map((s) => segmentsToEvents(s.segments)), (...vals) => {
        const known = vals.filter((v) => v === 'green' || v === 'yellow' || v === 'red');
        if (!known.length) return null;
        const red = known.filter((v) => v === 'red').length;
        if (red >= 2 && red / known.length > 0.5) return 'red';
        return red ? 'yellow' : 'green';
      });
      const segments = buildSegments(events, coverage);
      const ms = { green: 0, yellow: 0, red: 0 };
      for (const seg of segments) ms[seg.s] += seg.b - seg.a;
      summary = {
        segments: segments.map(({ a, b, s }) => ({ a, b, s })),
        ms,
        incidents: incidentsFromSegments(segments, from, to, now),
      };
    }
    out.push({
      origin,
      label: labels.get(origin) || origin,
      heartbeatKey: o.heartbeatKey,
      checkKeys: o.checks.map((s) => s.key),
      summary,
    });
  }
  out.sort((x, y) => String(x.label).localeCompare(String(y.label)));
  return out;
}

const median = (arr) => {
  if (!arr.length) return null;
  const a = [...arr].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
};
const mean = (arr) => (arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : null);

export const BASELINE_RECENT_MS = 60 * 60_000;
export const BASELINE_NORMAL_MS = 7 * 86_400_000;

// "Is this normal?" per network check: median latency / mean loss over the
// last hour vs the 7 days before it. Rows must cover
// [now - BASELINE_RECENT_MS - BASELINE_NORMAL_MS, now].
export function computeBaselines(rows, meta, now) {
  const recentFrom = now - BASELINE_RECENT_MS;
  const normalFrom = recentFrom - BASELINE_NORMAL_MS;
  const acc = new Map();
  for (const r of rows) {
    if (!r.k || r.c || r.t < normalFrom || r.t > now || !isNetworkMeta(meta[r.k])) continue;
    if (r.lat == null && r.loss == null) continue;
    if (!acc.has(r.k)) acc.set(r.k, { recentLat: [], normalLat: [], recentLoss: [], normalLoss: [] });
    const a = acc.get(r.k);
    const recent = r.t >= recentFrom;
    if (r.lat != null) (recent ? a.recentLat : a.normalLat).push(r.lat);
    if (r.loss != null) (recent ? a.recentLoss : a.normalLoss).push(r.loss);
  }
  const out = {};
  for (const [k, a] of acc) {
    out[k] = {
      recentLat: median(a.recentLat), normalLat: median(a.normalLat),
      recentLoss: mean(a.recentLoss), normalLoss: mean(a.normalLoss),
      recentN: a.recentLat.length + a.recentLoss.length,
      normalN: a.normalLat.length + a.normalLoss.length,
    };
  }
  return out;
}

const pad2 = (n) => String(n).padStart(2, '0');
// Local calendar day, so the heatmap's rows match the user's clock.
export function localDayKey(t) {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Time-of-day patterns and flapping for every network check in [from, to]:
//   cells       — [{ day, hour, lat, loss, n }] local day × hour averages
//   flapsByDay  — { day: flaps } from the agents' rolling transitions1h:
//                 the last sample in each clock hour covers exactly that
//                 hour, so summing those doesn't double count
export function buildPatterns(rows, meta, from, to) {
  const out = {};
  const lastTr = new Map(); // key|day|hour → { t, tr }
  for (const r of rows) {
    if (!r.k || r.c || r.t < from || r.t > to || !isNetworkMeta(meta[r.k])) continue;
    const d = new Date(r.t);
    const day = localDayKey(r.t);
    const hour = d.getHours();
    if (!out[r.k]) out[r.k] = { cells: new Map(), flapsByDay: {} };
    const o = out[r.k];
    if (r.lat != null || r.loss != null) {
      const ck = `${day}|${hour}`;
      if (!o.cells.has(ck)) o.cells.set(ck, { day, hour, latSum: 0, latN: 0, lossSum: 0, lossN: 0 });
      const cell = o.cells.get(ck);
      if (r.lat != null) { cell.latSum += r.lat; cell.latN += 1; }
      if (r.loss != null) { cell.lossSum += r.loss; cell.lossN += 1; }
    }
    if (r.tr != null) {
      const tk = `${r.k}|${day}|${hour}`;
      const prev = lastTr.get(tk);
      if (!prev || r.t >= prev.t) lastTr.set(tk, { t: r.t, tr: r.tr });
    }
  }
  for (const [tk, { tr }] of lastTr) {
    const [k, day] = tk.split('|');
    const f = out[k].flapsByDay;
    f[day] = (f[day] || 0) + tr;
  }
  const days = [];
  for (let t = from; localDayKey(t) <= localDayKey(to); t += 86_400_000) {
    const dk = localDayKey(t);
    if (days[days.length - 1] !== dk) days.push(dk);
  }
  if (days[days.length - 1] !== localDayKey(to)) days.push(localDayKey(to));
  const result = {};
  for (const [k, o] of Object.entries(out)) {
    result[k] = {
      cells: [...o.cells.values()].map((c) => ({
        day: c.day, hour: c.hour,
        lat: c.latN ? c.latSum / c.latN : null,
        loss: c.lossN ? c.lossSum / c.lossN : null,
        n: c.latN + c.lossN,
      })),
      flapsByDay: o.flapsByDay,
      hasFlapData: Object.keys(o.flapsByDay).length > 0,
    };
  }
  return { days, byKey: result };
}

// Latency / loss samples within [from, to] for the given items:
// topicKey → [{ t, lat, loss, up }].
export function extractSamples(rows, keys, from, to) {
  const want = new Set(keys);
  const out = {};
  for (const k of want) out[k] = [];
  for (const r of rows) {
    if (!want.has(r.k) || r.t < from || r.t > to || r.c) continue;
    if (r.lat == null && r.loss == null && r.up == null) continue;
    out[r.k].push({ t: r.t, lat: r.lat ?? null, loss: r.loss ?? null, up: r.up ?? null });
  }
  for (const k of want) out[k].sort((x, y) => x.t - y.t);
  return out;
}
