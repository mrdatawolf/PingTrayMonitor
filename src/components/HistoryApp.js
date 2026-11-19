// History window (desktop only — opened from the tray's "Open History").
// Reads what electron/historyStore.js recorded while the app was running.
// Views:
//   Status      — uptime strips per subject/location, incident list, and a
//                 per-item drawer with latency / packet-loss charts
//   Sources     — the same checks grouped by the server running them, with
//                 a combined row that flags "this server's own connection"
//   Performance — latency / packet loss / jitter per location, one chart
//                 per circuit, plus "compared to normal" (last hour vs week)
//   Patterns    — time-of-day heatmap and a flaps/outages stability table
//   Heartbeats  — a string of lights per reporting server, telling
//                 "monitoring stopped" apart from "site unreachable"
// Time the app wasn't recording is drawn hatched — unknown, never assumed up.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ConfigProvider, theme as antTheme, Segmented, Switch, Table, Tag, Drawer, Button, Spin, Empty, Alert, Select,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getColors } from '../theme';

const RANGES = {
  '24h': 24 * 3_600_000,
  '7d':  7 * 86_400_000,
  '30d': 30 * 86_400_000,
};
const REFRESH_MS = 60_000;

// Same hues as the tray (brown = server not reporting, see StatusPanel.js).
const STATUS_COLORS = { green: '#52c41a', yellow: '#faad14', red: '#ff4d4f', silent: '#c49a6c' };
const STATUS_TEXT = { green: 'Up', yellow: 'Degraded', red: 'Down', grey: 'Unknown', silent: 'Unknown — reporting server silent' };
const SERVER_STATUS_TEXT = {
  green: 'Reporting', red: 'Not reporting, site unreachable', grey: 'Unknown', silent: 'Not reporting, site still reachable',
};
const LATENCY_COLOR = '#4096ff';

// Categorical line colors (validated for both surfaces), assigned in fixed
// order by location — never cycled.
const SERIES_COLORS = {
  dark:  ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#0ca30c'],
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300'],
};
const NETWORK_CHECK_TYPES = new Set(['icmp', 'tcp']);

const GROUP_KIND = {
  connections_status: 'Multi-location circuit',
  connection_status: 'Checks',
  process_status: 'Pipelines',
  heartbeat: 'Server heartbeats',
};

const TYPE_CHIP = { icmp: 'ICMP', tcp: 'TCP', file_mtime: 'FILE', dated_file_exists: 'FILE', db_currency: 'DB' };

const hasBridge = typeof window !== 'undefined' && !!window.electron?.getHistory;

// ─── Formatting ───────────────────────────────────────────────────────────────

function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

function formatPct(p) {
  if (p == null) return '—';
  if (p >= 100) return '100%';
  if (p >= 99.9) return `${(Math.floor(p * 100) / 100).toFixed(2)}%`;
  return `${(Math.floor(p * 10) / 10).toFixed(1)}%`;
}

const fmtDateTime = (t) => new Date(t).toLocaleString(undefined, {
  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});
const fmtTime = (t) => new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
const fmtDay = (t) => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function statusText(series, s) {
  if (series?.type === 'origin') return ORIGIN_STATUS_TEXT[s] || s;
  return (series?.type === 'heartbeat' ? SERVER_STATUS_TEXT : STATUS_TEXT)[s] || s;
}

// ─── Time axis ────────────────────────────────────────────────────────────────

const HOUR = 3_600_000;
const DAY = 86_400_000;
const TICK_STEPS = [HOUR, 2 * HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR, DAY, 2 * DAY, 5 * DAY, 7 * DAY];

// Ticks aligned to local hour / midnight boundaries, about one per 90px.
function timeTicks(from, to, width) {
  const maxTicks = Math.max(2, Math.floor(width / 90));
  const step = TICK_STEPS.find((s) => (to - from) / s <= maxTicks) || TICK_STEPS[TICK_STEPS.length - 1];
  const d = new Date(from);
  if (step < DAY) {
    d.setMinutes(0, 0, 0);
    const h = step / HOUR;
    d.setHours(Math.floor(d.getHours() / h) * h);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  const ticks = [];
  for (let t = d.getTime(); t <= to; t += step) if (t >= from) ticks.push(t);
  const label = (t) => {
    if (step >= DAY) return fmtDay(t);
    const x = new Date(t);
    return x.getHours() === 0 && x.getMinutes() === 0 ? fmtDay(t) : fmtTime(t);
  };
  return ticks.map((t) => ({ t, label: label(t) }));
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

// Callback ref, so it also works for elements that mount after the
// component does (the drawer body, the strips once data arrives).
function useElementWidth() {
  const [el, setEl] = useState(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return [setEl, width];
}

// ─── Shared bits ──────────────────────────────────────────────────────────────

function HatchDefs({ c }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <pattern id="hist-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill={c.panelBgAlt} />
          <line x1="0" y1="0" x2="0" y2="6" stroke={c.border} strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  );
}

function Dot({ status, c }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, display: 'inline-block',
      background: STATUS_COLORS[status] || c.greyDot,
    }} />
  );
}

function FloatingTip({ tip, c }) {
  if (!tip) return null;
  const left = Math.min(tip.x + 14, window.innerWidth - 300);
  return (
    <div style={{
      position: 'fixed', left, top: tip.y + 14, zIndex: 2000, pointerEvents: 'none',
      background: c.headerBg, border: `1px solid ${c.border}`, borderRadius: 6,
      padding: '6px 10px', fontSize: 12, color: c.textBody, maxWidth: 290,
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
    }}>
      {tip.content}
    </div>
  );
}

function TimeAxis({ from, to, width, c }) {
  if (!width) return <div style={{ height: 18 }} />;
  const ticks = timeTicks(from, to, width);
  return (
    <svg width={width} height={18} style={{ display: 'block' }}>
      {ticks.map(({ t, label }) => {
        const x = ((t - from) / (to - from)) * width;
        return (
          <g key={t}>
            <line x1={x} x2={x} y1={13} y2={18} stroke={c.border} />
            <text x={x} y={10} fontSize="10" fill={c.textTertiary} textAnchor={x < 30 ? 'start' : x > width - 30 ? 'end' : 'middle'}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Coverage (recording) background + colored status segments + crosshair.
function Strip({ series, data, width, height = 16, hoverT, onHover, onLeave, onClick, c }) {
  if (!width) return <div style={{ height }} />;
  const { from, to, coverage } = data;
  const x = (t) => ((t - from) / (to - from)) * width;

  const order = { green: 0, grey: 1, silent: 2, yellow: 3, red: 4 };
  const segs = [...series.segments].sort((p, q) => order[p.s] - order[q.s]);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const t = from + ((e.clientX - rect.left) / rect.width) * (to - from);
    onHover?.(t, e.clientX, e.clientY);
  };

  return (
    <svg
      width={width} height={height} role="img"
      aria-label={`${series.label}: ${formatPct(series.uptimePct)} up, ${series.incidents.length} incidents`}
      style={{ display: 'block', cursor: onClick ? 'pointer' : 'default', borderRadius: 3 }}
      onMouseMove={handleMove} onMouseLeave={onLeave} onClick={onClick}
    >
      <rect width={width} height={height} fill="url(#hist-hatch)" />
      {coverage.map(([a, b]) => (
        <rect key={a} x={x(a)} width={Math.max(0, x(b) - x(a))} height={height} fill={c.borderSubtle} />
      ))}
      {segs.map((seg) => {
        const sx = x(seg.a);
        const w = Math.max(x(seg.b) - sx, seg.s === 'green' ? 0 : 2);
        return <rect key={`${seg.a}-${seg.s}`} x={sx} width={w} height={height} fill={STATUS_COLORS[seg.s] || c.greyDot} />;
      })}
      {hoverT != null && hoverT >= from && hoverT <= to && (
        <line x1={x(hoverT)} x2={x(hoverT)} y1={0} y2={height} stroke={c.textPrimary} strokeWidth="1" opacity="0.7" />
      )}
    </svg>
  );
}

function stripTipContent(series, data, t) {
  const seg = series.segments.find((s) => t >= s.a && t <= s.b);
  const recording = data.coverage.some(([a, b]) => t >= a && t <= b);
  return (
    <>
      <div style={{ fontWeight: 600 }}>{series.groupLabel} › {series.label}</div>
      <div style={{ opacity: 0.75 }}>{fmtDateTime(t)}</div>
      {seg ? (
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot status={seg.s} c={{}} />
          <span>
            {statusText(series, seg.s)} for {formatDuration(seg.b - seg.a)}
            <span style={{ opacity: 0.7 }}> ({fmtTime(seg.a)} – {fmtTime(seg.b)})</span>
          </span>
        </div>
      ) : (
        <div style={{ marginTop: 4, opacity: 0.75 }}>
          {recording ? 'No data for this item yet' : 'Not recording — app closed, asleep, or broker unreachable'}
        </div>
      )}
    </>
  );
}

// ─── Metric chart (latency / packet loss) ─────────────────────────────────────

function niceCeil(v) {
  if (!(v > 0)) return 1;
  const pow = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= v) return m * pow;
  return 10 * pow;
}

function bucketize(samples, field, from, to, n) {
  const bw = (to - from) / n;
  const buckets = Array.from({ length: n }, (_, i) => ({ a: from + i * bw, b: from + (i + 1) * bw, sum: 0, count: 0, min: Infinity, max: -Infinity }));
  for (const s of samples) {
    const v = s[field];
    if (v == null) continue;
    const i = Math.min(n - 1, Math.max(0, Math.floor((s.t - from) / bw)));
    const bk = buckets[i];
    bk.sum += v; bk.count += 1;
    if (v < bk.min) bk.min = v;
    if (v > bk.max) bk.max = v;
  }
  for (const bk of buckets) bk.avg = bk.count ? bk.sum / bk.count : null;
  return buckets;
}

function MetricChart({ title, unit, samples, field, mode, data, series, width, hoverT, setHoverT, c, minMax, baseline }) {
  const height = 150;
  const pad = { l: 46, r: 10, t: 10, b: 22 };
  const plotW = Math.max(0, width - pad.l - pad.r);
  const plotH = height - pad.t - pad.b;
  const { from, to } = data;
  const n = Math.max(10, Math.min(400, Math.floor(plotW / 4)));

  const buckets = useMemo(() => bucketize(samples, field, from, to, n), [samples, field, from, to, n]);
  const dataMax = Math.max(0, ...buckets.filter((b) => b.count).map((b) => b.max));
  const yMax = niceCeil(Math.max(dataMax, minMax, baseline || 0));
  const x = (t) => pad.l + ((t - from) / (to - from)) * plotW;
  const y = (v) => pad.t + plotH - (v / yMax) * plotH;
  const bwPx = plotW / n;

  const fmtV = (v) => `${v >= 100 || Number.isInteger(v) ? Math.round(v) : v.toFixed(1)}${unit}`;
  const hasData = buckets.some((b) => b.count);

  // Line through bucket averages, broken where a bucket has no samples.
  let path = '';
  let penDown = false;
  buckets.forEach((bk) => {
    if (bk.avg == null) { penDown = false; return; }
    const px = x((bk.a + bk.b) / 2);
    path += `${penDown ? 'L' : 'M'}${px.toFixed(1)},${y(bk.avg).toFixed(1)}`;
    penDown = true;
  });

  const hoverBucket = hoverT != null && hoverT >= from && hoverT <= to
    ? buckets[Math.min(n - 1, Math.floor(((hoverT - from) / (to - from)) * n))]
    : null;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - pad.l;
    if (px < 0 || px > plotW) { setHoverT(null); return; }
    setHoverT(from + (px / plotW) * (to - from));
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary }}>{title}</span>
        <span style={{ fontSize: 12, color: c.textSecondary, marginLeft: 'auto', minHeight: 18 }}>
          {hoverBucket && (hoverBucket.count
            ? <>{fmtTime(hoverBucket.a)}–{fmtTime(hoverBucket.b)}: {mode === 'bars'
              ? <>max <b style={{ color: c.textPrimary }}>{fmtV(hoverBucket.max)}</b></>
              : <>avg <b style={{ color: c.textPrimary }}>{fmtV(hoverBucket.avg)}</b> · max {fmtV(hoverBucket.max)}</>}
              {' '}({hoverBucket.count} sample{hoverBucket.count !== 1 ? 's' : ''})</>
            : <>{fmtTime(hoverBucket.a)}–{fmtTime(hoverBucket.b)}: no samples</>)}
        </span>
      </div>
      {!width ? <div style={{ height }} /> : (
        <svg width={width} height={height} style={{ display: 'block' }} onMouseMove={handleMove} onMouseLeave={() => setHoverT(null)}
          role="img" aria-label={`${title} over the selected range`}>
          {/* Not recording */}
          <rect x={pad.l} y={pad.t} width={plotW} height={plotH} fill="url(#hist-hatch)" opacity="0.6" />
          {data.coverage.map(([a, b]) => (
            <rect key={a} x={x(a)} y={pad.t} width={Math.max(0, x(b) - x(a))} height={plotH} fill={c.panelBg} />
          ))}
          {/* Down periods for context */}
          {series.segments.filter((s) => s.s === 'red').map((s) => (
            <rect key={s.a} x={x(s.a)} y={pad.t} width={Math.max(2, x(s.b) - x(s.a))} height={plotH} fill={STATUS_COLORS.red} opacity="0.14" />
          ))}
          {/* Recessive grid */}
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={pad.l} x2={pad.l + plotW} y1={y(yMax * f)} y2={y(yMax * f)} stroke={c.borderSubtle} />
              <text x={pad.l - 6} y={y(yMax * f) + 3} fontSize="10" fill={c.textTertiary} textAnchor="end">{fmtV(yMax * f)}</text>
            </g>
          ))}
          {baseline != null && (
            <g>
              <line x1={pad.l} x2={pad.l + plotW} y1={y(baseline)} y2={y(baseline)} stroke={c.textSecondary} strokeDasharray="5 4" />
            </g>
          )}
          {mode === 'bars'
            ? buckets.filter((bk) => bk.count && bk.max > 0).map((bk) => (
              <rect key={bk.a} x={x(bk.a) + 1} y={y(bk.max)} width={Math.max(1, bwPx - 2)} height={Math.max(1, y(0) - y(bk.max))} fill={LATENCY_COLOR} rx="1" />
            ))
            : (
              <>
                {buckets.filter((bk) => bk.count > 1 && bk.max > bk.min).map((bk) => (
                  <rect key={bk.a} x={x(bk.a)} y={y(bk.max)} width={Math.max(1, bwPx)} height={Math.max(1, y(bk.min) - y(bk.max))} fill={LATENCY_COLOR} opacity="0.2" />
                ))}
                <path d={path} fill="none" stroke={LATENCY_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              </>
            )}
          {baseline != null && (
            <g>
              <rect x={pad.l + 4} y={y(baseline) - 15} width={150} height={13} rx="2" fill={c.headerBg} opacity="0.92" />
              <text x={pad.l + 8} y={y(baseline) - 5} fontSize="10" fill={c.textSecondary}>
                normal (7-day median) {fmtV(baseline)}
              </text>
            </g>
          )}
          {!hasData && (
            <text x={pad.l + plotW / 2} y={pad.t + plotH / 2} fontSize="12" fill={c.textTertiary} textAnchor="middle">No samples in this range</text>
          )}
          {hoverBucket && (
            <line x1={x(hoverT)} x2={x(hoverT)} y1={pad.t} y2={pad.t + plotH} stroke={c.textPrimary} opacity="0.6" />
          )}
          <g transform={`translate(${pad.l},${pad.t + plotH + 2})`}>
            {timeTicks(from, to, plotW).map(({ t, label }) => (
              <text key={t} x={x(t) - pad.l} y={14} fontSize="10" fill={c.textTertiary} textAnchor="middle">{label}</text>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function DetailDrawer({ series, data, onClose, c, baseline }) {
  const [samples, setSamples] = useState(null);
  const [hoverT, setHoverT] = useState(null);
  const [ref, width] = useElementWidth();
  const [tip, setTip] = useState(null);

  useEffect(() => {
    setSamples(null);
    if (!series?.hasMetrics) return;
    let cancelled = false;
    window.electron.getHistorySamples([series.key], data.from, data.to)
      .then((m) => { if (!cancelled) setSamples(m?.[series.key] || []); })
      .catch(() => { if (!cancelled) setSamples([]); });
    return () => { cancelled = true; };
  }, [series?.key, series?.hasMetrics, data.from, data.to]);

  const hasLatency = samples?.some((s) => s.lat != null);
  const hasLoss = samples?.some((s) => s.loss != null);

  return (
    <Drawer
      open={!!series} onClose={onClose} width={680} destroyOnClose
      title={series && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot status={series.lastStatus} c={c} />
          <span>{series.groupLabel} <span style={{ color: c.textTertiary }}>›</span> {series.label}</span>
          {series.checkType && TYPE_CHIP[series.checkType] && <Tag style={{ marginLeft: 4 }}>{TYPE_CHIP[series.checkType]}</Tag>}
        </div>
      )}
    >
      {series && (
        <div ref={ref}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <StatTile c={c} label="Uptime" value={formatPct(series.uptimePct)} sub="of recorded time" />
            <StatTile c={c} label="Time down" value={formatDuration(series.ms.red)} sub={series.ms.yellow ? `${formatDuration(series.ms.yellow)} degraded` : 'no degraded time'} />
            <StatTile c={c} label="Incidents" value={series.incidents.filter((i) => i.kind === 'down').length}
              sub={series.ms.silent ? `+ ${formatDuration(series.ms.silent)} with its server silent` : series.incidents.some((i) => i.ongoing) ? 'one ongoing' : 'in this range'} />
          </div>

          <div style={{ marginBottom: 4 }}><TimeAxis from={data.from} to={data.to} width={width} c={c} /></div>
          <Strip
            series={series} data={data} width={width} height={22} c={c} hoverT={hoverT}
            onHover={(t, cx, cy) => { setHoverT(t); setTip({ x: cx, y: cy, content: stripTipContent(series, data, t) }); }}
            onLeave={() => { setHoverT(null); setTip(null); }}
          />
          <div style={{ height: 20 }} />

          {!series.hasMetrics && (
            <Alert type="info" showIcon message="This item doesn't report latency or packet loss — only its up/down status is recorded." style={{ marginBottom: 16 }} />
          )}
          {series.hasMetrics && samples == null && <div style={{ textAlign: 'center', padding: 30 }}><Spin /></div>}
          {hasLatency && (
            <MetricChart title="Latency" unit=" ms" field="lat" samples={samples} data={data} series={series} width={width}
              hoverT={hoverT} setHoverT={setHoverT} c={c} minMax={10} baseline={baseline?.normalLat} />
          )}
          {hasLoss && (
            <MetricChart title="Packet loss (worst in period)" unit="%" field="loss" mode="bars" samples={samples} data={data} series={series} width={width}
              hoverT={hoverT} setHoverT={setHoverT} c={c} minMax={10} />
          )}

          <div style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary, margin: '8px 0' }}>Incidents</div>
          {series.incidents.length === 0
            ? <div style={{ color: c.textSecondary, fontSize: 12 }}>No downtime recorded in this range.</div>
            : (
              <Table
                size="small" pagination={series.incidents.length > 8 ? { pageSize: 8 } : false}
                rowKey="start" dataSource={[...series.incidents].reverse()}
                columns={[
                  { title: '', key: 'kind', width: 120, render: (_, r) => <KindTag r={r} /> },
                  { title: 'Started', key: 'start', render: (_, r) => <IncidentStart r={r} /> },
                  { title: 'Ended', key: 'end', render: (_, r) => (r.ongoing ? <Tag color="red">Ongoing</Tag> : <>{r.cutEnd && 'after '}{fmtDateTime(r.end)}</>) },
                  { title: 'Duration', key: 'dur', render: (_, r) => <IncidentDuration r={r} now={data.now} /> },
                ]}
              />
            )}
        </div>
      )}
      <FloatingTip tip={tip} c={c} />
    </Drawer>
  );
}

// ─── Summary pieces ───────────────────────────────────────────────────────────

function StatTile({ label, value, sub, c }) {
  return (
    <div style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: c.textPrimary, fontVariantNumeric: 'tabular-nums', margin: '2px 0' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: c.textTertiary }}>{sub}</div>}
    </div>
  );
}

function KindTag({ r }) {
  if (r.kind === 'silent') {
    return <Tag color="#8a6a45" title="The server stopped publishing but its site still answered pings">Not reporting</Tag>;
  }
  return r.ongoing ? <Tag color="red">Ongoing</Tag> : <Tag>Resolved</Tag>;
}

function IncidentStart({ r }) {
  return <>{r.cutStart && 'before '}{fmtDateTime(r.start)}</>;
}

function IncidentDuration({ r, now }) {
  const d = (r.end ?? now) - r.start;
  const atLeast = r.cutStart || r.cutEnd || r.ongoing;
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{atLeast ? '≥ ' : ''}{formatDuration(d)}</span>;
}

// ─── Latency view ─────────────────────────────────────────────────────────────

// One line per location: shared time buckets, average latency per bucket,
// broken where a location had no samples (down, its server silent, or not
// recording). A thin rail per location under the plot marks why.
function MultiLineChart({ lines, data, c, onSelect, metric }) {
  const [wrapRef, width] = useElementWidth();
  const [hidden, setHidden] = useState(() => new Set());
  const [hover, setHover] = useState(null); // { t, x, y }
  const { from, to } = data;
  const RAIL = 5;
  const height = 230 + lines.length * (RAIL + 3);
  const pad = { l: 46, r: 12, t: 10, b: 24 + lines.length * (RAIL + 3) };
  const plotW = Math.max(0, width - pad.l - pad.r);
  const plotH = height - pad.t - pad.b;
  const n = Math.max(10, Math.min(300, Math.floor(plotW / 4)));

  const bucketed = useMemo(
    () => lines.map((l) => ({ ...l, buckets: bucketize(l.samples || [], metric.field, from, to, n) })),
    [lines, metric.field, from, to, n],
  );
  const visible = bucketed.filter((l) => !hidden.has(l.key));
  const dataMax = Math.max(0, ...visible.flatMap((l) => l.buckets.filter((b) => b.count).map((b) => b.avg)));
  const yMax = niceCeil(Math.max(dataMax, metric.minMax));
  const x = (t) => pad.l + ((t - from) / (to - from)) * plotW;
  const y = (v) => pad.t + plotH - (v / yMax) * plotH;
  const fmtMs = (v) => `${v >= 100 || v === 0 ? Math.round(v) : v.toFixed(1)}${metric.unit}`;

  const pathFor = (buckets) => {
    let d = '';
    let pen = false;
    for (const bk of buckets) {
      if (bk.avg == null) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${x((bk.a + bk.b) / 2).toFixed(1)},${y(bk.avg).toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  const hoverIdx = hover ? Math.min(n - 1, Math.max(0, Math.floor(((hover.t - from) / (to - from)) * n))) : null;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - pad.l;
    if (px < 0 || px > plotW) { setHover(null); return; }
    setHover({ t: from + (px / plotW) * (to - from), x: e.clientX, y: e.clientY });
  };

  const statusAt = (series, t) => series.segments.find((s) => t >= s.a && t <= s.b)?.s;

  const tip = hover && hoverIdx != null && {
    x: hover.x, y: hover.y,
    content: (
      <>
        <div style={{ opacity: 0.75, marginBottom: 4 }}>
          {fmtDateTime(bucketed[0].buckets[hoverIdx].a)} – {fmtTime(bucketed[0].buckets[hoverIdx].b)}
        </div>
        {visible.map((l) => {
          const bk = l.buckets[hoverIdx];
          const st = statusAt(l.series, hover.t);
          return (
            <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <span style={{ width: 10, height: 3, borderRadius: 2, background: l.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{l.label}</span>
              <b style={{ marginLeft: 10 }}>
                {bk.count ? fmtMs(bk.avg) : st === 'red' ? 'down' : st === 'silent' ? 'server silent' : '—'}
              </b>
              {bk.count > 1 && <span style={{ opacity: 0.6 }}>max {fmtMs(bk.max)}</span>}
            </div>
          );
        })}
      </>
    ),
  };

  return (
    <div ref={wrapRef}>
      {/* Legend — also the toggle for each line */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 8 }}>
        {bucketed.map((l) => {
          const off = hidden.has(l.key);
          const all = (l.samples || []).filter((s) => s[metric.field] != null);
          const avg = all.length ? all.reduce((sum, s) => sum + s[metric.field], 0) / all.length : null;
          return (
            <span key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: off ? 0.45 : 1 }}>
              <button
                type="button"
                onClick={() => setHidden((h) => { const nh = new Set(h); if (nh.has(l.key)) nh.delete(l.key); else nh.add(l.key); return nh; })}
                title={off ? 'Show this line' : 'Hide this line'}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: c.textBody, padding: 0, font: 'inherit' }}
              >
                <span style={{ width: 16, height: 3, borderRadius: 2, background: l.color }} />
                {l.label}
              </button>
              <span style={{ color: c.textTertiary, fontVariantNumeric: 'tabular-nums' }}>{avg != null ? `avg ${fmtMs(avg)}` : 'no samples'}</span>
              <button type="button" onClick={() => onSelect(l.key)} title="Details for this location"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textTertiary, padding: 0, fontSize: 11, textDecoration: 'underline' }}>
                details
              </button>
            </span>
          );
        })}
      </div>

      {!width ? <div style={{ height }} /> : (
        <svg width={width} height={height} style={{ display: 'block' }} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}
          role="img" aria-label={`${metric.label} over time for ${lines.map((l) => l.label).join(', ')}`}>
          <rect x={pad.l} y={pad.t} width={plotW} height={plotH} fill="url(#hist-hatch)" opacity="0.6" />
          {data.coverage.map(([a, b]) => (
            <rect key={a} x={x(a)} y={pad.t} width={Math.max(0, x(b) - x(a))} height={plotH} fill={c.panelBg} />
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1={pad.l} x2={pad.l + plotW} y1={y(yMax * f)} y2={y(yMax * f)} stroke={c.borderSubtle} />
              <text x={pad.l - 6} y={y(yMax * f) + 3} fontSize="10" fill={c.textTertiary} textAnchor="end">{+(yMax * f).toFixed(2)}{metric.unit}</text>
            </g>
          ))}
          {visible.map((l) => (
            <path key={l.key} d={pathFor(l.buckets)} fill="none" stroke={l.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {hoverIdx != null && (
            <>
              <line x1={x(hover.t)} x2={x(hover.t)} y1={pad.t} y2={pad.t + plotH} stroke={c.textPrimary} opacity="0.6" />
              {visible.map((l) => {
                const bk = l.buckets[hoverIdx];
                return bk.count ? (
                  <circle key={l.key} cx={x((bk.a + bk.b) / 2)} cy={y(bk.avg)} r="4" fill={l.color} stroke={c.panelBg} strokeWidth="2" />
                ) : null;
              })}
            </>
          )}
          <g transform={`translate(0,${pad.t + plotH})`}>
            {timeTicks(from, to, plotW).map(({ t, label }) => (
              <text key={t} x={x(t)} y={14} fontSize="10" fill={c.textTertiary} textAnchor="middle">{label}</text>
            ))}
          </g>
          {/* Per-location rails: why a line has a gap */}
          {bucketed.map((l, i) => {
            const ry = pad.t + plotH + 22 + i * (RAIL + 3);
            return (
              <g key={l.key} opacity={hidden.has(l.key) ? 0.35 : 1}>
                <rect x={pad.l - 14} y={ry} width={8} height={RAIL} rx="1" fill={l.color} />
                <rect x={pad.l} y={ry} width={plotW} height={RAIL} fill={c.borderFaint} />
                {l.series.segments.filter((s) => s.s === 'red' || s.s === 'silent').map((s) => (
                  <rect key={s.a} x={x(s.a)} y={ry} width={Math.max(2, x(s.b) - x(s.a))} height={RAIL} fill={STATUS_COLORS[s.s]} />
                ))}
              </g>
            );
          })}
        </svg>
      )}
      <FloatingTip tip={tip} c={c} />
    </div>
  );
}

const METRICS = {
  lat:  { field: 'lat',  label: 'Latency',     unit: ' ms', minMax: 10, help: 'Average round-trip time' },
  loss: { field: 'loss', label: 'Packet loss', unit: '%',   minMax: 5,  help: 'Average packet loss' },
  jit:  { field: 'jit',  label: 'Jitter',      unit: ' ms', minMax: 5,  help: 'How much latency jumps between consecutive checks — high jitter hurts calls and video before anything goes down' },
};

// Jitter per sample: change in latency from the previous sample (skipped
// across gaps, where the previous sample isn't really "previous").
function withJitter(samples) {
  const out = [];
  let prev = null;
  for (const s of samples || []) {
    let jit = null;
    if (s.lat != null && prev && prev.lat != null && s.t - prev.t < 20 * 60_000) jit = Math.abs(s.lat - prev.lat);
    out.push({ ...s, jit });
    if (s.lat != null) prev = s;
  }
  return out;
}

function networkLineGroups(data) {
  const out = [];
  for (const g of data.groups) {
    if (g.type !== 'connections_status' && g.type !== 'connection_status') continue;
    const lines = g.series.filter((s) => s.hasMetrics && (g.type === 'connections_status' || NETWORK_CHECK_TYPES.has(s.checkType)));
    if (lines.length) out.push({ group: g, lines });
  }
  return out;
}

// "Is this normal?" — last hour vs the previous 7 days, per network check.
function CompareToNormal({ data, baselines, c, onSelect }) {
  const rows = [];
  for (const g of data.groups) {
    for (const s of g.series) {
      const b = baselines?.[s.key];
      if (!b || b.recentLat == null || b.normalLat == null) continue;
      const ratio = b.normalLat > 0 ? b.recentLat / b.normalLat : 1;
      const diff = b.recentLat - b.normalLat;
      const lossUp = b.recentLoss != null && b.normalLoss != null && b.recentLoss - b.normalLoss >= 2;
      const flag = ratio >= 2 && diff >= 10 ? 'much' : ratio >= 1.4 && diff >= 5 ? 'slower' : ratio <= 0.6 && diff <= -5 ? 'faster' : null;
      rows.push({ key: s.key, s, b, ratio, diff, lossUp, flag });
    }
  }
  const rank = (r) => (r.flag === 'much' ? 3 : r.flag === 'slower' ? 2 : r.lossUp ? 1 : 0);
  rows.sort((x, y) => rank(y) - rank(x) || y.ratio - x.ratio);
  const flagged = rows.filter((r) => rank(r) > 0).length;
  const fmt = (v) => (v == null ? '—' : `${v >= 100 ? Math.round(v) : v.toFixed(1)} ms`);
  const fmtL = (v) => (v == null ? '—' : `${v >= 10 || v === 0 ? Math.round(v) : v.toFixed(1)}%`);

  return (
    <section style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>Compared to normal</span>
        <span style={{ fontSize: 11, color: c.textTertiary }}>Median latency in the last hour vs the 7 days before it — independent of the range above</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: flagged ? c.textBody : c.textTertiary }}>
          {baselines == null ? 'Loading…' : flagged ? `${flagged} running abnormally` : 'Everything within its normal range'}
        </span>
      </div>
      {baselines != null && !rows.length && (
        <div style={{ fontSize: 12, color: c.textSecondary }}>Not enough history yet — needs samples from the last hour and the week before.</div>
      )}
      {rows.length > 0 && (
        <Table
          size="small" rowKey="key" dataSource={rows}
          pagination={rows.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
          onRow={(r) => ({ onClick: () => onSelect(r.key), style: { cursor: 'pointer' } })}
          columns={[
            {
              title: '', key: 'flag', width: 140,
              render: (_, r) => (
                <>
                  {r.flag === 'much' && <Tag color="red">Much slower</Tag>}
                  {r.flag === 'slower' && <Tag color="gold">Slower</Tag>}
                  {r.flag === 'faster' && <Tag color="green">Faster</Tag>}
                  {r.lossUp && <Tag color="orange">More loss</Tag>}
                  {!r.flag && !r.lossUp && <span style={{ color: c.textTertiary, fontSize: 12 }}>Normal</span>}
                </>
              ),
            },
            {
              title: 'Check', key: 'what',
              render: (_, r) => (
                <span>
                  <span style={{ color: c.textPrimary }}>{r.s.groupLabel}</span>
                  <span style={{ color: c.textTertiary }}> › </span>
                  <span style={{ color: c.textSecondary }}>{r.s.label}</span>
                </span>
              ),
            },
            { title: 'Last hour', key: 'recent', align: 'right', width: 100, render: (_, r) => <b style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(r.b.recentLat)}</b> },
            { title: 'Normal', key: 'normal', align: 'right', width: 100, render: (_, r) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(r.b.normalLat)}</span> },
            {
              title: 'Change', key: 'chg', align: 'right', width: 130,
              render: (_, r) => (
                <span style={{ fontVariantNumeric: 'tabular-nums', color: r.flag && r.flag !== 'faster' ? c.textPrimary : c.textSecondary }}>
                  {r.diff >= 0 ? '+' : '−'}{fmt(Math.abs(r.diff))} <span style={{ color: c.textTertiary }}>({r.ratio.toFixed(1)}×)</span>
                </span>
              ),
            },
            {
              title: 'Loss hour / normal', key: 'loss', align: 'right', width: 170,
              render: (_, r) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtL(r.b.recentLoss)} / {fmtL(r.b.normalLoss)}</span>,
            },
          ]}
        />
      )}
    </section>
  );
}

function PerformanceView({ data, c, mode, onSelect, baselines }) {
  const [metricKey, setMetricKey] = useState('lat');
  const metric = METRICS[metricKey];
  const cards = useMemo(() => networkLineGroups(data), [data]);

  const keys = cards.flatMap((cd) => cd.lines.map((s) => s.key));
  const keysId = keys.join('|');
  const [samples, setSamples] = useState(null);

  useEffect(() => {
    if (!keys.length) { setSamples({}); return undefined; }
    let cancelled = false;
    window.electron.getHistorySamples(keys, data.from, data.to)
      .then((m) => {
        if (cancelled) return;
        const withJ = {};
        for (const [k, v] of Object.entries(m || {})) withJ[k] = withJitter(v);
        setSamples(withJ);
      })
      .catch(() => { if (!cancelled) setSamples({}); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysId, data.from, data.to]);

  const palette = SERIES_COLORS[mode === 'light' ? 'light' : 'dark'];
  return (
    <>
      <CompareToNormal data={data} baselines={baselines} c={c} onSelect={onSelect} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <Segmented value={metricKey} onChange={setMetricKey}
          options={Object.entries(METRICS).map(([k, m]) => ({ label: m.label, value: k }))} />
        <span style={{ fontSize: 12, color: c.textSecondary }}>{metric.help}, per location.</span>
      </div>
      {!cards.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No latency recorded in this range yet (only ICMP/TCP checks report it)." />}
      {cards.length > 0 && !samples && <div style={{ textAlign: 'center', padding: 60 }}><Spin /></div>}
      {samples && cards.map(({ group, lines }) => (
        <section key={group.id} style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>{group.label}</span>
            <span style={{ fontSize: 11, color: c.textTertiary }}>
              {group.type === 'connections_status'
                ? `${metric.label} from each of ${lines.length} location${lines.length !== 1 ? 's' : ''}`
                : 'Network checks from this server'}
            </span>
          </div>
          {lines.length > palette.length && (
            <div style={{ fontSize: 11, color: c.textTertiary, marginBottom: 6 }}>Showing the first {palette.length}.</div>
          )}
          <MultiLineChart
            c={c} data={data} onSelect={onSelect} metric={metric}
            lines={lines.slice(0, palette.length).map((s, i) => ({ key: s.key, label: s.label, color: palette[i], samples: samples[s.key], series: s }))}
          />
        </section>
      ))}
    </>
  );
}

// ─── Sources view (grouped by the server doing the checking) ─────────────────

const ORIGIN_STATUS_TEXT = {
  green: 'All its checks up',
  yellow: 'Some of its checks down',
  red: 'Most of its checks down at once — suspect this server’s own connection',
};

function SourcesView({ data, c, onSelect }) {
  const [axisRef, width] = useElementWidth();
  const [hover, setHover] = useState(null);
  const seriesByKey = new Map();
  for (const g of data.groups) for (const s of g.series) seriesByKey.set(s.key, s);

  if (!data.origins?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No network checks recorded in this range." />;
  }

  const rowGrid = { display: 'grid', gridTemplateColumns: `${LABEL_COL}px 1fr ${NUM_COL}px ${NUM_COL}px`, columnGap: 12, alignItems: 'center' };
  const row = (s, label, { bold, sub, clickable = true } = {}) => (
    <div key={s.key} className={clickable ? 'history-strip-row' : undefined}
      onClick={clickable ? () => onSelect(s.key) : undefined}
      style={{ ...rowGrid, padding: '4px 0', cursor: clickable ? 'pointer' : 'default' }}>
      <div className={clickable ? 'history-row-label' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, fontSize: 12, color: bold ? c.textPrimary : c.textBody, fontWeight: bold ? 600 : 400 }}>
        <Dot status={s.lastStatus} c={c} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={sub || label}>{label}</span>
      </div>
      <Strip series={s} data={data} width={width} c={c} hoverT={hover?.t}
        onHover={(t, x, y) => setHover({ t, x, y, s })} onLeave={() => setHover(null)} />
      <div style={{ fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: c.textPrimary }}>
        {s.uptimePct != null ? formatPct(s.uptimePct) : ''}
      </div>
      <div style={{ fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: s.ms?.red ? c.textBody : c.textTertiary }}>
        {s.ms?.red ? formatDuration(s.ms.red) : '—'}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ fontSize: 12, color: c.textSecondary, marginBottom: 12, maxWidth: 960 }}>
        Grouped by the server running the checks. If most checks from one server fail <i>at the same moment</i> — to different
        destinations — the problem is likely that server&apos;s own connection, not the places it&apos;s checking.
      </div>
      <section style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px' }}>
        <div style={{ ...rowGrid, alignItems: 'end' }}>
          <div />
          <div ref={axisRef}><TimeAxis from={data.from} to={data.to} width={width} c={c} /></div>
          <div style={{ fontSize: 11, color: c.textTertiary, textAlign: 'right' }}>Uptime</div>
          <div style={{ fontSize: 11, color: c.textTertiary, textAlign: 'right' }}>Down</div>
        </div>
        {data.origins.map((o) => {
          const hb = o.heartbeatKey && seriesByKey.get(o.heartbeatKey);
          const checks = o.checkKeys.map((k) => seriesByKey.get(k)).filter(Boolean);
          const uplink = o.summary?.incidents || [];
          const summarySeries = o.summary && {
            key: `origin:${o.origin}`, type: 'origin', label: 'All checks from here', groupLabel: o.label,
            segments: o.summary.segments, ms: o.summary.ms, incidents: uplink, uptimePct: null,
            lastStatus: o.summary.segments[o.summary.segments.length - 1]?.s,
          };
          return (
            <div key={o.origin} style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, paddingBottom: 4, borderBottom: `1px solid ${c.borderFaint}`, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary }}>{o.label}</span>
                <span style={{ fontSize: 11, color: c.textTertiary }}>{checks.length} network check{checks.length !== 1 ? 's' : ''}</span>
                {o.summary && (
                  <span style={{ marginLeft: 'auto', fontSize: 12 }}>
                    {uplink.length
                      ? <Tag color="red">Own connection suspected {uplink.length}× · {formatDuration(o.summary.ms.red)}</Tag>
                      : <span style={{ color: c.textTertiary }}>No shared failures</span>}
                  </span>
                )}
              </div>
              {summarySeries && row(summarySeries, 'All checks from here', { bold: true, clickable: false })}
              {hb && row(hb, 'Server heartbeat')}
              {checks.map((s) => row(s, s.type === 'connections_status' ? `→ ${s.groupLabel}` : `→ ${s.label}`, { sub: `${s.groupLabel} › ${s.label}` }))}
            </div>
          );
        })}
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, color: c.textSecondary, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>All checks from here:</span>
          {[['green', 'all up'], ['yellow', 'some down'], ['red', 'most down at once']].map(([st, l]) => (
            <span key={st} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 8, borderRadius: 2, background: STATUS_COLORS[st] }} />{l}
            </span>
          ))}
        </div>
      </section>
      <FloatingTip tip={hover && { x: hover.x, y: hover.y, content: stripTipContent(hover.s, data, hover.t) }} c={c} />
    </>
  );
}

// ─── Patterns view (time of day + stability) ─────────────────────────────────

// Sequential single-hue ramp; low values recede toward the surface.
const HEAT_RAMP = {
  light: ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'],
  dark:  ['#123a6e', '#184f95', '#256abf', '#2a78d6', '#5598e7', '#86b6ef', '#cde2fb'],
};

function percentile(sorted, p) {
  if (!sorted.length) return null;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * p)))];
}

function Heatmap({ days, cells, field, unit, mode, c }) {
  const [tip, setTip] = useState(null);
  const ramp = HEAT_RAMP[mode === 'light' ? 'light' : 'dark'];
  const byKey = new Map(cells.map((cell) => [`${cell.day}|${cell.hour}`, cell]));
  const values = cells.map((cell) => cell[field]).filter((v) => v != null).sort((a, b) => a - b);
  const lo = field === 'loss' ? 0 : percentile(values, 0.02) ?? 0;
  const hi = Math.max(percentile(values, 0.98) ?? 1, lo + (field === 'loss' ? 5 : 1));
  const colorFor = (v) => {
    if (v == null) return null;
    const f = Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
    return ramp[Math.min(ramp.length - 1, Math.floor(f * ramp.length))];
  };
  const fmtV = (v) => `${v >= 100 || v === 0 ? Math.round(v) : v.toFixed(1)}${unit}`;

  const hourly = Array.from({ length: 24 }, (_, h) => {
    const vs = days.map((d) => byKey.get(`${d}|${h}`)?.[field]).filter((v) => v != null);
    return vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
  });

  const dayLabel = (d) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const grid = { display: 'grid', gridTemplateColumns: '110px repeat(24, 1fr)', gap: 2 };
  const cell = (v, title, key) => (
    <div key={key}
      onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, content: title })}
      onMouseLeave={() => setTip(null)}
      style={{
        height: 20, borderRadius: 3,
        ...(v == null
          ? { background: `repeating-linear-gradient(45deg, ${c.panelBgAlt} 0 4px, ${c.borderSubtle} 4px 6px)` }
          : { background: colorFor(v) }),
      }} />
  );

  return (
    <div>
      <div style={grid}>
        <div />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} style={{ fontSize: 10, color: c.textTertiary, textAlign: 'center' }}>{h % 3 === 0 ? `${String(h).padStart(2, '0')}` : ''}</div>
        ))}
        {days.map((d) => (
          <React.Fragment key={d}>
            <div style={{ fontSize: 11, color: c.textSecondary, alignSelf: 'center', whiteSpace: 'nowrap' }}>{dayLabel(d)}</div>
            {Array.from({ length: 24 }, (_, h) => {
              const cl = byKey.get(`${d}|${h}`);
              const v = cl?.[field];
              return cell(v, (
                <>
                  <div style={{ fontWeight: 600 }}>{dayLabel(d)}, {String(h).padStart(2, '0')}:00–{String(h + 1).padStart(2, '0')}:00</div>
                  <div>{v != null ? <>avg <b>{fmtV(v)}</b> ({cl.n} samples)</> : 'No data — not recording or no samples'}</div>
                </>
              ), `${d}-${h}`);
            })}
          </React.Fragment>
        ))}
        <div style={{ fontSize: 11, color: c.textPrimary, fontWeight: 600, alignSelf: 'center', paddingTop: 6 }}>Typical day</div>
        {hourly.map((v, h) => (
          <div key={`avg-${h}`} style={{ paddingTop: 6 }}>
            {cell(v, (
              <>
                <div style={{ fontWeight: 600 }}>{String(h).padStart(2, '0')}:00 on an average day</div>
                <div>{v != null ? <>avg <b>{fmtV(v)}</b></> : 'No data'}</div>
              </>
            ), `avg-cell-${h}`)}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 11, color: c.textSecondary }}>
        <span>{fmtV(lo)}</span>
        <span style={{ display: 'flex' }}>
          {ramp.map((col) => <span key={col} style={{ width: 22, height: 10, background: col }} />)}
        </span>
        <span>{fmtV(hi)}+</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 12 }}>
          <svg width="16" height="10" aria-hidden="true"><rect width="16" height="10" rx="2" fill="url(#hist-hatch)" /></svg>No data
        </span>
        <span style={{ marginLeft: 'auto', color: c.textTertiary }}>Hours in this computer&apos;s local time</span>
      </div>
      <FloatingTip tip={tip} c={c} />
    </div>
  );
}

function FlapBars({ days, flapsByDay, max, c }) {
  const w = 8;
  const h = 22;
  return (
    <svg width={days.length * (w + 2)} height={h} aria-hidden="true" style={{ display: 'block' }}>
      {days.map((d, i) => {
        const v = flapsByDay?.[d];
        const bh = v ? Math.max(2, (v / max) * h) : 0;
        return (
          <g key={d}>
            <rect x={i * (w + 2)} y={h - 1} width={w} height={1} fill={c.borderSubtle} />
            {v > 0 && <rect x={i * (w + 2)} y={h - bh} width={w} height={bh} rx="1" fill={LATENCY_COLOR}><title>{`${d}: ${v} flap${v !== 1 ? 's' : ''}`}</title></rect>}
          </g>
        );
      })}
    </svg>
  );
}

function PatternsView({ data, c, mode, onSelect }) {
  const [patterns, setPatterns] = useState(null);
  const [selected, setSelected] = useState(null);
  const [field, setField] = useState('lat');
  const span = data.to - data.from;

  useEffect(() => {
    let cancelled = false;
    window.electron.getHistoryPatterns(span)
      .then((p) => { if (!cancelled) setPatterns(p); })
      .catch(() => { if (!cancelled) setPatterns({ days: [], byKey: {} }); });
    return () => { cancelled = true; };
  }, [span, data.to]);

  const networkSeries = [];
  for (const g of data.groups) {
    for (const s of g.series) {
      if (g.type === 'connections_status' || (g.type === 'connection_status' && NETWORK_CHECK_TYPES.has(s.checkType))) networkSeries.push(s);
    }
  }
  const withCells = networkSeries.filter((s) => patterns?.byKey[s.key]?.cells.length);
  const current = withCells.find((s) => s.key === selected) || withCells[0];

  if (!patterns) return <div style={{ textAlign: 'center', padding: 60 }}><Spin /></div>;
  if (!networkSeries.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No network checks recorded in this range." />;

  const options = [];
  const seen = new Map();
  for (const s of withCells) {
    if (!seen.has(s.groupLabel)) { seen.set(s.groupLabel, { label: s.groupLabel, options: [] }); options.push(seen.get(s.groupLabel)); }
    seen.get(s.groupLabel).options.push({ label: `${s.groupLabel} › ${s.label}`, value: s.key });
  }

  const stability = networkSeries.map((s) => {
    const p = patterns.byKey[s.key];
    const flaps = p ? Object.values(p.flapsByDay).reduce((a, b) => a + b, 0) : 0;
    const outages = s.incidents.filter((i) => i.kind === 'down').length;
    return { key: s.key, s, p, flaps, outages };
  }).sort((x, y) => (y.flaps + y.outages) - (x.flaps + x.outages) || y.s.ms.red - x.s.ms.red);
  const maxFlaps = Math.max(1, ...stability.flatMap((r) => Object.values(r.p?.flapsByDay || {})));

  return (
    <>
      <section style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>Time of day</span>
          <Select
            style={{ minWidth: 340 }} value={current?.key} onChange={setSelected} options={options}
            showSearch optionFilterProp="label" placeholder="Choose a check"
          />
          <Segmented value={field} onChange={setField} options={[{ label: 'Latency', value: 'lat' }, { label: 'Packet loss', value: 'loss' }]} />
          {current && (
            <Button size="small" type="link" onClick={() => onSelect(current.key)}>Details</Button>
          )}
        </div>
        <div style={{ fontSize: 12, color: c.textSecondary, marginBottom: 12 }}>
          Each cell is one hour. Problems that repeat at the same time every day — backups, business-hours load, a nightly ISP job — show up as a vertical band.
          {span <= DAY && ' Choose 7 or 30 days to compare across days.'}
        </div>
        {current
          ? <Heatmap days={patterns.days} cells={patterns.byKey[current.key].cells} field={field} unit={field === 'loss' ? '%' : ' ms'} mode={mode} c={c} />
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No latency samples in this range." />}
      </section>

      <section style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>Stability</span>
          <span style={{ fontSize: 11, color: c.textTertiary }}>
            Flaps are brief drops the agents caught between reports (from their per-hour counts); outages are the down periods this app recorded
          </span>
        </div>
        <Table
          size="small" rowKey="key" dataSource={stability}
          pagination={stability.length > 12 ? { pageSize: 12, showSizeChanger: false } : false}
          onRow={(r) => ({ onClick: () => onSelect(r.key), style: { cursor: 'pointer' } })}
          columns={[
            {
              title: 'Check', key: 'what',
              render: (_, r) => (
                <span>
                  <span style={{ color: c.textPrimary }}>{r.s.groupLabel}</span>
                  <span style={{ color: c.textTertiary }}> › </span>
                  <span style={{ color: c.textSecondary }}>{r.s.label}</span>
                </span>
              ),
            },
            {
              title: 'Flaps per day', key: 'bars', width: Math.max(120, patterns.days.length * 10 + 16),
              render: (_, r) => (r.p?.hasFlapData
                ? <FlapBars days={patterns.days} flapsByDay={r.p.flapsByDay} max={maxFlaps} c={c} />
                : <span style={{ fontSize: 11, color: c.textTertiary }} title="Flap counts are recorded from this version on, for agents that report transitions1h">not recorded yet</span>),
            },
            { title: 'Flaps', key: 'flaps', align: 'right', width: 80, render: (_, r) => (r.p?.hasFlapData ? <b>{r.flaps}</b> : '—') },
            { title: 'Outages', key: 'out', align: 'right', width: 80, render: (_, r) => (r.outages ? <b>{r.outages}</b> : <span style={{ color: c.textTertiary }}>0</span>) },
            { title: 'Down time', key: 'down', align: 'right', width: 100, render: (_, r) => (r.s.ms.red ? formatDuration(r.s.ms.red) : <span style={{ color: c.textTertiary }}>—</span>) },
          ]}
        />
      </section>
    </>
  );
}

// ─── Heartbeats view ──────────────────────────────────────────────────────────

const LIGHT_RANK = { off: 0, grey: 1, green: 2, yellow: 3, silent: 4, red: 5 };

function lightBucketMs(span) {
  if (span <= DAY) return 30 * 60_000;
  if (span <= 7 * DAY) return 3 * HOUR;
  return 12 * HOUR;
}

// Each light = one time bucket, showing the worst state seen in it.
function serverLights(series, data) {
  const size = lightBucketMs(data.to - data.from);
  const lights = [];
  for (let a = data.to - Math.ceil((data.to - data.from) / size) * size; a < data.to; a += size) {
    const b = a + size;
    const ms = {};
    let status = data.coverage.some(([ca, cb]) => ca < b && cb > a) ? 'grey' : 'off';
    for (const seg of series.segments) {
      const ov = Math.min(seg.b, b) - Math.max(seg.a, a);
      if (ov <= 0) continue;
      ms[seg.s] = (ms[seg.s] || 0) + ov;
      if (LIGHT_RANK[seg.s] > LIGHT_RANK[status]) status = seg.s;
    }
    lights.push({ a: Math.max(a, data.from), b, status, ms });
  }
  return lights;
}

function ServersView({ data, c, onSelect }) {
  const [axisRef, width] = useElementWidth();
  const [tip, setTip] = useState(null);
  const servers = data.groups.find((g) => g.type === 'heartbeat')?.series || [];
  const subjectLabels = new Map(
    data.groups.filter((g) => g.type === 'connections_status').map((g) => [g.id.replace(/^subject:/, ''), g.label]),
  );
  const size = lightBucketMs(data.to - data.from);

  if (!servers.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No server heartbeats recorded in this range." />;
  }

  const lightTip = (s, l) => (
    <>
      <div style={{ fontWeight: 600 }}>{s.label}</div>
      <div style={{ opacity: 0.75 }}>{fmtDateTime(l.a)} – {fmtTime(l.b)}</div>
      <div style={{ marginTop: 4 }}>
        {l.status === 'off' && 'Not recording'}
        {Object.entries(l.ms).map(([st, ms]) => (
          <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dot status={st} c={c} /> {SERVER_STATUS_TEXT[st] || st}: {formatDuration(ms)}
          </div>
        ))}
        {l.status === 'grey' && !Object.keys(l.ms).length && 'No heartbeat seen yet'}
      </div>
    </>
  );

  return (
    <section style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>Reporting servers</div>
      <div style={{ fontSize: 12, color: c.textSecondary, margin: '4px 0 12px', maxWidth: 900 }}>
        Each light is {formatDuration(size)} and shows the worst moment in it. When a location&apos;s server goes silent, its checks
        stop updating and can look like an outage — compare with whether the site still answered pings from other locations.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `${LABEL_COL}px 1fr 150px`, columnGap: 12, alignItems: 'end', marginBottom: 6 }}>
        <div />
        <div ref={axisRef}><TimeAxis from={data.from} to={data.to} width={width} c={c} /></div>
        <div style={{ fontSize: 11, color: c.textTertiary, textAlign: 'right' }}>Silent / unreachable</div>
      </div>
      {servers.map((s) => {
        const lights = serverLights(s, data);
        const reach = (s.reach || []).map((id) => subjectLabels.get(id) || id);
        return (
          <div key={s.key} style={{ display: 'grid', gridTemplateColumns: `${LABEL_COL}px 1fr 150px`, columnGap: 12, alignItems: 'center', padding: '8px 0', borderTop: `1px solid ${c.borderFaint}` }}>
            <div style={{ minWidth: 0, cursor: 'pointer' }} onClick={() => onSelect(s.key)} className="history-strip-row">
              <div className="history-row-label" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.textPrimary }}>
                <Dot status={s.lastStatus} c={c} /> {s.label}
              </div>
              <div style={{ fontSize: 11, color: c.textTertiary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={reach.length ? `Site reachability judged from: ${reach.join(', ')}` : 'Set this server’s reachability subjects in Settings to tell a silent server from a down site'}>
                {reach.length ? `Site checked via ${reach.join(', ')}` : 'No site reachability configured'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${lights.length}, 1fr)`, alignItems: 'center' }}
              onMouseLeave={() => setTip(null)}>
              {lights.map((l) => (
                <div key={l.a} style={{ display: 'flex', justifyContent: 'center', padding: '3px 0' }}
                  onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, content: lightTip(s, l) })}>
                  <span style={{
                    width: 'min(12px, 80%)', aspectRatio: '1', borderRadius: '50%', display: 'block',
                    ...(l.status === 'off'
                      ? { border: `1px dashed ${c.border}` }
                      : { background: STATUS_COLORS[l.status] || c.greyDot }),
                  }} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: c.textBody }}>
              <span style={{ color: s.ms.silent ? c.textBody : c.textTertiary }}>{s.ms.silent ? formatDuration(s.ms.silent) : '—'}</span>
              <span style={{ color: c.textTertiary }}> / </span>
              <span style={{ color: s.ms.red ? c.textBody : c.textTertiary }}>{s.ms.red ? formatDuration(s.ms.red) : '—'}</span>
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: c.textSecondary, flexWrap: 'wrap' }}>
        {[['green', 'Heartbeat received'], ['silent', 'Server silent — site still reachable (monitoring problem)'], ['red', 'Server silent and site unreachable (likely down)']].map(([st, l]) => (
          <span key={st} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Dot status={st} c={c} />{l}</span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1px dashed ${c.border}` }} />Not recording
        </span>
      </div>
      <FloatingTip tip={tip} c={c} />
    </section>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

const LABEL_COL = 240;
const NUM_COL = 72;

export default function HistoryApp() {
  const [mode, setMode] = useState('dark');
  const [range, setRange] = useState('24h');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('status'); // 'status' | 'sources' | 'performance' | 'patterns' | 'heartbeats'
  const [baselines, setBaselines] = useState(null);
  const [problemsOnly, setProblemsOnly] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [hover, setHover] = useState(null); // { t, key, x, y }
  const [axisRef, stripWidth] = useElementWidth();
  const c = getColors(mode);

  useEffect(() => {
    document.title = 'Ping Monitor — History';
    window.electron?.getTheme?.().then((t) => t && setMode(t));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const load = useCallback(() => {
    if (!hasBridge) return;
    setLoading(true);
    window.electron.getHistoryBaselines?.().then(setBaselines).catch(() => setBaselines({}));
    window.electron.getHistory(RANGES[range])
      .then((d) => { setData(d); setError(null); })
      .catch((err) => setError(err?.message || String(err)))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const groups = useMemo(() => {
    if (!data) return [];
    // Acknowledged checks (marked "seen" in the details popup) sink to the
    // bottom of their group, and groups whose only current problems are
    // acknowledged sink below every other group.
    const acked = new Set(data.acknowledged || []);
    const all = data.groups.map((g) => ({
      ...g,
      series: g.series
        .map((s) => (acked.has(s.key) ? { ...s, acknowledged: true } : s))
        .sort((a, b) => !!a.acknowledged - !!b.acknowledged),
    }));
    const isAckedGroup = (g) => g.series.some((s) => s.acknowledged)
      && g.series.every((s) => s.acknowledged || s.lastStatus === 'green');
    const ordered = [...all.filter((g) => !isAckedGroup(g)), ...all.filter(isAckedGroup)];
    if (!problemsOnly) return ordered;
    return ordered
      .map((g) => ({ ...g, series: g.series.filter((s) => s.ms.red + s.ms.yellow + s.ms.silent > 0) }))
      .filter((g) => g.series.length);
  }, [data, problemsOnly]);

  const seriesByKey = useMemo(() => {
    const m = new Map();
    for (const g of data?.groups || []) for (const s of g.series) m.set(s.key, s);
    return m;
  }, [data]);

  const selected = selectedKey ? seriesByKey.get(selectedKey) : null;
  const span = data ? data.to - data.from : 1;
  const coveragePct = data ? (data.coveredMs / span) * 100 : 0;
  const downIncidents = data ? data.incidents.filter((i) => i.kind === 'down') : [];
  const silentCount = data ? data.incidents.length - downIncidents.length : 0;
  const totalDown = downIncidents.reduce((sum, i) => sum + ((i.end ?? data.now) - i.start), 0);
  const longest = downIncidents.reduce((best, i) => {
    const d = (i.end ?? data.now) - i.start;
    return !best || d > best.d ? { d, i } : best;
  }, null);
  const ongoingCount = downIncidents.filter((i) => i.ongoing).length;
  const hoverSeries = hover ? seriesByKey.get(hover.key) : null;

  const tip = hover && hoverSeries
    ? { x: hover.x, y: hover.y, content: stripTipContent(hoverSeries, data, hover.t) }
    : null;

  return (
    <ConfigProvider theme={{
      algorithm: mode === 'light' ? antTheme.defaultAlgorithm : antTheme.darkAlgorithm,
      token: { colorPrimary: '#52c41a', borderRadius: 6, colorBgContainer: c.panelBg, colorBgElevated: c.headerBg },
    }}>
      <HatchDefs c={c} />
      <div style={{ minHeight: '100vh', background: c.pageBg, color: c.textBody }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 10, background: c.headerBg, borderBottom: `1px solid ${c.borderSubtle}`,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: c.textPrimary }}>Connection history</div>
            <div style={{ fontSize: 12, color: c.textSecondary }}>
              {data ? <>{fmtDateTime(data.from)} – {fmtDateTime(data.to)}</> : 'Recorded by this app while it runs'}
            </div>
          </div>
          <Segmented value={view} onChange={setView} options={[
            { label: 'Status', value: 'status' },
            { label: 'Sources', value: 'sources' },
            { label: 'Performance', value: 'performance' },
            { label: 'Patterns', value: 'patterns' },
            { label: 'Heartbeats', value: 'heartbeats' },
          ]} />
          {view === 'status' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: c.textSecondary }}>
              <Switch size="small" checked={problemsOnly} onChange={setProblemsOnly} />
              Only items with problems
            </label>
          )}
          <Segmented value={range} onChange={setRange} options={[
            { label: '24 hours', value: '24h' }, { label: '7 days', value: '7d' }, { label: '30 days', value: '30d' },
          ]} />
          <Button icon={<ReloadOutlined spin={loading} />} onClick={load} title="Refresh" />
        </header>

        <main style={{ padding: '16px 20px 40px', maxWidth: 1600, margin: '0 auto' }}>
          {!hasBridge && (
            <Empty description="History is only available in the desktop app — it's recorded locally while the app runs." style={{ marginTop: 80 }} />
          )}
          {error && <Alert type="error" showIcon message="Couldn't load history" description={error} style={{ marginBottom: 16 }} />}
          {hasBridge && !data && !error && <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>}

          {data && view === 'sources' && <SourcesView data={data} c={c} onSelect={setSelectedKey} />}
          {data && view === 'performance' && <PerformanceView data={data} c={c} mode={mode} onSelect={setSelectedKey} baselines={baselines} />}
          {data && view === 'patterns' && <PatternsView data={data} c={c} mode={mode} onSelect={setSelectedKey} />}
          {data && view === 'heartbeats' && <ServersView data={data} c={c} onSelect={setSelectedKey} />}

          {data && view === 'status' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
                <StatTile c={c} label="Incidents" value={downIncidents.length}
                  sub={`${ongoingCount ? `${ongoingCount} ongoing` : 'none ongoing'}${silentCount ? ` · ${silentCount} server silence${silentCount !== 1 ? 's' : ''}` : ''}`} />
                <StatTile c={c} label="Total time down" value={formatDuration(totalDown)} sub="summed across incidents" />
                <StatTile c={c} label="Longest incident" value={longest ? formatDuration(longest.d) : '—'}
                  sub={longest ? `${longest.i.groupLabel} · ${fmtDay(longest.i.start)}` : 'nothing went down'} />
                <StatTile c={c} label="Recorded" value={formatPct(coveragePct)}
                  sub={data.recordingSince ? `of this range · history since ${fmtDay(Date.parse(data.recordingSince))}` : 'of this range'} />
              </div>

              {coveragePct < 99 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: c.textSecondary, marginBottom: 16 }}>
                  <svg width="22" height="12" aria-hidden="true"><rect width="22" height="12" rx="2" fill="url(#hist-hatch)" /></svg>
                  Hatched time wasn't recorded: this app was closed, the computer was asleep, or the broker was unreachable.
                </div>
              )}

              {/* Uptime strips */}
              <section style={{
                background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: `${LABEL_COL}px 1fr ${NUM_COL}px ${NUM_COL}px`, columnGap: 12, alignItems: 'end' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary }}>Status over time</div>
                  <div ref={axisRef}><TimeAxis from={data.from} to={data.to} width={stripWidth} c={c} /></div>
                  <div style={{ fontSize: 11, color: c.textTertiary, textAlign: 'right' }}>Uptime</div>
                  <div style={{ fontSize: 11, color: c.textTertiary, textAlign: 'right' }}>Down</div>
                </div>

                {groups.length === 0 && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={problemsOnly ? 'No problems recorded in this range.' : 'Nothing recorded in this range yet. History builds up while the app runs.'}
                  />
                )}

                {groups.map((g) => (
                  <div key={g.id} style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, paddingBottom: 4, borderBottom: `1px solid ${c.borderFaint}` }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary }}>{g.label}</span>
                      <span style={{ fontSize: 11, color: c.textTertiary }}>
                        {GROUP_KIND[g.type]}{g.type === 'connections_status' ? ` · ${g.series.length} location${g.series.length !== 1 ? 's' : ''}` : ''}
                      </span>
                    </div>
                    {g.series.map((s) => (
                      <div
                        key={s.key} className="history-strip-row"
                        onClick={() => setSelectedKey(s.key)}
                        style={{
                          display: 'grid', gridTemplateColumns: `${LABEL_COL}px 1fr ${NUM_COL}px ${NUM_COL}px`, columnGap: 12,
                          alignItems: 'center', padding: '4px 0', cursor: 'pointer',
                        }}
                      >
                        <div className="history-row-label" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, fontSize: 12, color: c.textBody }}
                          title={`${s.label}${s.lastStatus ? ` — last ${statusText(s, s.lastStatus).toLowerCase()}` : ''}`}>
                          <Dot status={s.lastStatus} c={c} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                          {s.acknowledged && (
                            <span title="Acknowledged — ignored until this check next reports OK"
                              style={{ fontSize: 9, color: '#1677ff', border: '1px solid #1677ff', borderRadius: 3, padding: '0 3px', flexShrink: 0 }}>
                              ACK
                            </span>
                          )}
                          {s.checkType && TYPE_CHIP[s.checkType] && (
                            <span style={{ fontSize: 9, color: c.textTertiary, border: `1px solid ${c.borderSubtle}`, borderRadius: 3, padding: '0 3px', flexShrink: 0 }}>
                              {TYPE_CHIP[s.checkType]}
                            </span>
                          )}
                        </div>
                        <Strip
                          series={s} data={data} width={stripWidth} c={c} hoverT={hover?.t}
                          onHover={(t, x, y) => setHover({ t, key: s.key, x, y })}
                          onLeave={() => setHover(null)}
                        />
                        <div style={{ fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: c.textPrimary }}>
                          {formatPct(s.uptimePct)}
                        </div>
                        <div style={{ fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: s.ms.red ? c.textBody : c.textTertiary }}>
                          {s.ms.red ? formatDuration(s.ms.red) : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, color: c.textSecondary, flexWrap: 'wrap' }}>
                  {[['green', 'Up'], ['yellow', 'Degraded / late'], ['red', 'Down'], ['silent', 'Reporting server silent']].map(([s, l]) => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 12, height: 8, borderRadius: 2, background: STATUS_COLORS[s] }} />{l}
                    </span>
                  ))}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 12, height: 8, borderRadius: 2, background: c.borderSubtle }} />No data
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="8" aria-hidden="true"><rect width="12" height="8" rx="2" fill="url(#hist-hatch)" /></svg>Not recording
                  </span>
                  <span style={{ marginLeft: 'auto', color: c.textTertiary }}>Click a row for latency, packet loss and its incidents</span>
                </div>
              </section>

              {/* Incidents */}
              <section style={{ background: c.panelBg, border: `1px solid ${c.borderSubtle}`, borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary, marginBottom: 8 }}>Incidents</div>
                {data.incidents.length === 0 ? (
                  <div style={{ color: c.textSecondary, fontSize: 12, padding: '8px 0' }}>No downtime recorded in this range.</div>
                ) : (
                  <Table
                    size="small"
                    rowKey={(r) => `${r.groupLabel}-${r.keys.join(',')}-${r.start}`}
                    dataSource={data.incidents}
                    pagination={data.incidents.length > 12 ? { pageSize: 12, showSizeChanger: false } : false}
                    onRow={(r) => ({ onClick: () => setSelectedKey(r.keys[0]), style: { cursor: 'pointer' } })}
                    columns={[
                      { title: '', key: 'state', width: 120, render: (_, r) => <KindTag r={r} /> },
                      {
                        title: 'What', key: 'what',
                        render: (_, r) => (
                          <div>
                            <div style={{ fontWeight: 600, color: c.textPrimary }}>{r.groupLabel}</div>
                            <div style={{ fontSize: 12, color: c.textSecondary }}>
                              {r.type !== 'heartbeat' ? r.label
                                : r.kind === 'silent' ? `${r.label} server stopped reporting — site still reachable`
                                  : `${r.label} server silent and site unreachable`}
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: 'Scope', key: 'scope', width: 190,
                        render: (_, r) => {
                          if (r.type !== 'connections_status' || r.totalLocations < 2) return <span style={{ color: c.textTertiary }}>—</span>;
                          const all = r.locations.length === r.totalLocations;
                          return (
                            <span title={all ? 'Every location lost it — likely a real outage' : 'Only some locations lost it — likely a path issue at those sites'}>
                              <Tag color={all ? 'red' : 'gold'}>{all ? 'All locations' : 'Partial'}</Tag>
                              <span style={{ fontSize: 12, color: c.textSecondary }}>{r.locations.length} of {r.totalLocations}</span>
                            </span>
                          );
                        },
                      },
                      { title: 'Started', key: 'start', width: 210, render: (_, r) => <IncidentStart r={r} /> },
                      { title: 'Duration', key: 'dur', width: 110, align: 'right', render: (_, r) => <IncidentDuration r={r} now={data.now} /> },
                    ]}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>

      <FloatingTip tip={tip} c={c} />
      {data && (
        <DetailDrawer series={selected} data={data} onClose={() => setSelectedKey(null)} c={c}
          baseline={selected ? baselines?.[selected.key] : null} />
      )}
    </ConfigProvider>
  );
}
