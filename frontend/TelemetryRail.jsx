/* global React */

/* ── Ref-based Lucide icon (avoids React reconciler conflict) ── */
function Ico({ n, s }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !window.lucide) return;
    const wrap = document.createElement('div');
    const el = document.createElement('i');
    el.setAttribute('data-lucide', n);
    wrap.appendChild(el);
    lucide.createIcons({ nodes: [wrap] });
    const svg = wrap.querySelector('svg');
    if (svg) { ref.current.innerHTML = ''; ref.current.appendChild(svg); }
  }, [n]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...s }} />;
}

/**
 * TelemetryRail — real-time stats + sector watchlist.
 * mobile=true  → full-page vertical card layout (used in mobile panel view)
 * mobile=false → narrow sidebar column (desktop)
 */
function TelemetryRail({ sector, sectors, selectedId, onSelect, mobile = false }) {
  const { Card, TelemetryStat, RiskMeter, Badge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;


  const waveWarn = parseFloat(sector.waves) >= 3;

  const containerStyle = mobile
    ? { display: 'flex', flexDirection: 'column', gap: 12 }
    : { display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)', width: 296, flexShrink: 0, overflowY: 'auto' };

  return (
    <div className={mobile ? '' : 'a3-scroll'} style={containerStyle}>

      {/* ── Live telemetry card ───────────────────────────── */}
      <Card eyebrow="即時遙測" title={sector.name} action={<Badge tone="ok" dot>即時</Badge>}>

        {/* Coordinate / station */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: -4, marginBottom: 14,
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        }}>
          <Ico n="map-pin" />
          {sector.coord} · {sector.station}
        </div>

        {/* Stats 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: mobile ? 12 : 10 }}>
          <TelemetryStat
            label="風速"
            value={sector.wind}
            unit="節"
            detail={sector.windDir}
            icon={<Ico n="wind" />}
          />
          <TelemetryStat
            label="浪高"
            value={sector.waves}
            unit="公尺"
            tone={waveWarn ? 'warn' : 'cyan'}
            icon={<Ico n="waves" />}
          />
          <TelemetryStat
            label="潮汐"
            value={sector.tide}
            tone="plain"
            icon={<Ico n="activity" />}
          />
          <TelemetryStat
            label="洋流"
            value={sector.current}
            unit="節"
            tone="accent"
            icon={<Ico n="navigation" />}
          />
        </div>

        {/* Risk meter */}
        <div style={{ marginTop: 18 }}>
          <RiskMeter value={sector.danger} label="翻覆風險指數" />
        </div>
      </Card>

      {/* ── Sector watchlist ─────────────────────────────── */}
      <Card eyebrow="區段監視" title="海岸網格" padding="var(--pad-card)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 10 : 8 }}>
          {sectors.map((s) => {
            const isSel = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', minHeight: mobile ? 52 : 44,
                  padding: mobile ? '12px 14px' : '9px 12px',
                  cursor: 'pointer', textAlign: 'left',
                  background: isSel ? 'var(--accent-soft)' : 'transparent',
                  border: `1px solid ${isSel ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--dur-fast) var(--ease-out)',
                }}
              >
                {/* Status dot */}
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: s.color,
                  boxShadow: `0 0 8px ${s.color}`,
                  flexShrink: 0,
                  animation: s.danger >= 7.5 ? 'a3-breathe 1.8s var(--ease-out) infinite' : 'none',
                }} />
                {/* Name */}
                <span style={{
                  flex: 1, minWidth: 0,
                  color: isSel ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: mobile ? 14 : 'var(--text-sm)',
                  fontWeight: isSel ? 600 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{s.name}</span>
                {/* Score */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: mobile ? 16 : 'var(--text-sm)',
                  fontWeight: 700,
                  color: s.color,
                  fontVariantNumeric: 'tabular-nums',
                }}>{s.danger.toFixed(1)}</span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

window.TelemetryRail = TelemetryRail;
