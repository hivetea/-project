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
 * A3 Header — responsive.
 * compact=true  → 48px mobile bar (logo + live dot + clock)
 * compact=false → 60px desktop bar (logo + nav + status + controls)
 */
function Header({ clock, compact = false }) {
  const { StatusBadge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  /* ── Mobile / Compact ────────────────────────────────────── */
  if (compact) {
    return (
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 48, flexShrink: 0,
        background: 'var(--surface-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 30,
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            position: 'relative', width: 32, height: 32,
            borderRadius: 8,
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow-accent)',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>A3</span>
            <span style={{ position: 'absolute', left: 4, right: 4, bottom: 4, height: 2, borderRadius: 2, background: 'var(--danger-scale)' }}></span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>海象情報</span>
        </div>

        {/* Right: live status + clock */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--ok)', display: 'inline-block',
              animation: 'a3-pulse 2s var(--ease-out) infinite',
            }}></span>
            <span style={{ fontSize: 11, color: 'var(--ok-text)', fontWeight: 600, letterSpacing: '0.04em' }}>即時</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums',
          }}>{clock}</span>
        </div>
      </header>
    );
  }

  /* ── Desktop ─────────────────────────────────────────────── */
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 var(--space-6)', height: 60, flexShrink: 0,
      background: 'var(--surface-panel)',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 30,
    }}>
      {/* Logo mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          position: 'relative', width: 38, height: 38,
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--glow-accent)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>A3</span>
          <span style={{ position: 'absolute', left: 6, right: 6, bottom: 5, height: 2.5, borderRadius: 2, background: 'var(--danger-scale)' }}></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.01em' }}>A3 海象 RAG 智慧情報</span>
          <span style={{ fontSize: 10, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>海象地圖 · Smart Maritime Intel</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 28 }}>
        {[['作業總覽', true], ['海象預報', false], ['規則庫', false], ['觀測站', false]].map(([t, active]) => (
          <span key={t} style={{
            padding: '7px 14px', fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
            background: active ? 'var(--surface-raised)' : 'transparent',
            fontWeight: active ? 600 : 400,
            transition: 'all var(--dur-fast) var(--ease-out)',
          }}>{t}</span>
        ))}
      </nav>

      {/* Right controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums',
        }}>{clock} <span style={{ color: 'var(--text-faint)' }}>UTC+8</span></span>
        <StatusBadge label="AI 引擎" status="上線" tone="ok" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Ico n="bell" s={{ width: 17, height: 17 }} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Ico n="settings" s={{ width: 17, height: 17 }} />
          </button>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', fontWeight: 600,
          }}>OC</div>
        </div>
      </div>
    </header>
  );
}





/**
 * GeospatialCanvas — dark-grid tactical map.
 * Clicking / tapping a sector node selects it.
 * mobile=true  → larger tap targets (44px+), simplified legend
 */
function GeospatialCanvas({ sectors, selectedId, onSelect, scanning, mobile = false }) {
  const { Badge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  /* dangerColor — inline (camelCase not on DS namespace) */
  function dangerColor(score) {
    const stops = [
      { v: 0.0,  c: [20,  100, 255] },
      { v: 2.5,  c: [0,   255, 255] },
      { v: 5.0,  c: [255, 255,   0] },
      { v: 7.5,  c: [255, 140,   0] },
      { v: 10.0, c: [255,  30,  30] },
    ];
    const s = Math.max(0, Math.min(10, score));
    let lo = stops[0], hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (s >= stops[i].v && s <= stops[i + 1].v) { lo = stops[i]; hi = stops[i + 1]; break; }
    }
    const t = hi.v === lo.v ? 0 : (s - lo.v) / (hi.v - lo.v);
    const ch = (k) => Math.round(lo.c[k] + (hi.c[k] - lo.c[k]) * t);
    return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
  }

  return (
    <div
      className="a3-grid-bg--map a3-scroll"
      style={{
        position: 'relative', flex: 1, minWidth: 0,
        borderRadius: mobile ? 0 : 'var(--radius-lg)',
        border: mobile ? 'none' : '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Radar scan rings (centred at Taiwan) */}
      <div style={{ position: 'absolute', left: '46%', top: '40%', width: 0, height: 0 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 220, height: 220,
            marginLeft: -110, marginTop: -110,
            borderRadius: '50%',
            border: '1.5px solid rgba(34,211,238,0.45)',
            animation: `a3-radar 3.6s var(--ease-out) ${i * 1.2}s infinite`,
          }} />
        ))}
      </div>

      {/* Sector nodes */}
      {sectors.map((s) => {
        const color = dangerColor(s.danger);
        const isSel = s.id === selectedId;
        const DOT = mobile ? (isSel ? 22 : 18) : (isSel ? 18 : 13);
        const HIT = mobile ? 52 : 36; // Tap / click target size

        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            aria-label={`選擇 ${s.name}，危險指數 ${s.danger.toFixed(1)}`}
            style={{
              position: 'absolute',
              left: `${s.x}%`, top: `${s.y}%`,
              transform: 'translate(-50%, -50%)',
              width: HIT, height: HIT,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4,
              background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 0,
              zIndex: isSel ? 5 : 2,
            }}
          >
            {/* Dot */}
            <span style={{
              width: DOT, height: DOT, borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${isSel ? 20 : 10}px ${color}`,
              border: isSel
                ? '2.5px solid var(--surface-base)'
                : '2px solid rgba(2,6,23,0.55)',
              transition: 'all var(--dur-base) var(--ease-out)',
              animation: s.danger >= 7.5 ? 'a3-breathe 1.8s var(--ease-out) infinite' : 'none',
              flexShrink: 0,
            }} />

            {/* Label */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: mobile ? 11 : 10,
              whiteSpace: 'nowrap',
              padding: '2px 6px',
              borderRadius: 'var(--radius-xs)',
              background: 'rgba(2,6,23,0.75)',
              color: isSel ? 'var(--text-primary)' : 'var(--text-muted)',
              border: `1px solid ${isSel ? 'var(--border-accent)' : 'transparent'}`,
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}>{s.name}</span>
          </button>
        );
      })}

      {/* Critical hazard callout */}
      <div style={{ position: 'absolute', right: '12%', top: '22%', transform: 'translate(0,-50%)', zIndex: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 12px',
          background: 'rgba(244,63,94,0.14)',
          border: '1px solid var(--crit-border)',
          borderRadius: 'var(--radius-full)',
          backdropFilter: 'blur(6px)',
          boxShadow: 'var(--glow-crit)',
        }}>
          <Ico n="triangle-alert" s={{ width: 13, height: 13, color: 'var(--crit-text)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--crit-text)', whiteSpace: 'nowrap' }}>瘋狗浪危險區</span>
        </div>
      </div>

      {/* Live scan badge (top-left) */}
      <div style={{ position: 'absolute', left: 14, top: 14, zIndex: 6 }}>
        <Badge tone={scanning ? 'cyan' : 'accent'} dot uppercase>
          {scanning ? '掃描區段中…' : '即時 · 115 觀測站'}
        </Badge>
      </div>

      {/* Zoom controls */}
      <div style={{ position: 'absolute', right: 14, bottom: mobile ? 14 : 80, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 6 }}>
        {['plus', 'minus'].map((n, i) => (
          <button key={n} aria-label={n === 'plus' ? '放大' : '縮小'} style={{
            width: mobile ? 40 : 32, height: mobile ? 40 : 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-glass)',
            cursor: 'pointer',
            borderRadius: i === 0
              ? 'var(--radius-sm) var(--radius-sm) 0 0'
              : '0 0 var(--radius-sm) var(--radius-sm)',
          }}>
            <Ico n={n} s={{ width: 15, height: 15 }} />
          </button>
        ))}
      </div>

      {/* Danger legend */}
      {!mobile && (
        <div className="a3-glass" style={{
          position: 'absolute', left: 14, bottom: 14,
          padding: '12px 14px', width: 224,
          borderRadius: 'var(--radius-md)', zIndex: 6,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600,
            letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 8,
          }}>危險指數 0–10</div>
          <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--danger-scale)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            {[0, 2.5, 5, 7.5, 10].map((n) => (
              <span key={n} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums',
              }}>{n.toFixed(1)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Mobile compact legend */}
      {mobile && (
        <div style={{
          position: 'absolute', left: 14, bottom: 14,
          padding: '8px 12px',
          background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-glass)',
          borderRadius: 10, zIndex: 6,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--danger-scale)' }}></div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>危險 0–10</span>
        </div>
      )}
    </div>
  );
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





/**
 * RagFeed — RAG retrieval stream + AI recommendation.
 * mobile=true → full-page layout, recommendation first (most important info at top)
 */
function RagFeed({ sector, scanning, onRerun, mobile = false }) {
  const { Card, Alert, RuleMatch, Button, Badge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  const rules = sector.rules || [];

  const recTone = sector.danger >= 7.5 ? 'crit' : sector.danger >= 5 ? 'warn' : 'recommend';

  const containerStyle = mobile
    ? { display: 'flex', flexDirection: 'column', gap: 12 }
    : { display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)', width: 352, flexShrink: 0, overflowY: 'auto' };

  return (
    <div className={mobile ? '' : 'a3-scroll'} style={containerStyle}>

      {/* ── On mobile: show AI recommendation FIRST (most actionable) ── */}
      {mobile && !scanning && (
        <Alert
          tone={recTone}
          eyebrow="AI 建議 · LLM 綜合研判"
          title={sector.rec.title}
          icon={<Ico n="navigation" />}
          action={<>
            <Button size="sm" variant="primary">確認</Button>
            <Button size="sm" variant="ghost">發布警報</Button>
          </>}
        >
          {sector.rec.body}
        </Alert>
      )}

      {/* ── RAG retrieval card ──────────────────────────────────── */}
      <Card
        eyebrow="航海日誌 · 向量檢索"
        title="RAG 推論串流"
        action={
          <Button
            size="sm"
            variant="secondary"
            icon={<Ico n="refresh-cw" s={{ width: 13, height: 13 }} />}
            onClick={onRerun}
          >
            重新檢索
          </Button>
        }
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {/* Query echo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px',
          background: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}>
          <Ico n="search" s={{ width: 13, height: 13, color: 'var(--data-cyan)' }} />
          <span style={{ color: 'var(--text-secondary)', marginRight: 4 }}>查詢:</span>
          風 {sector.windDir.split(' ')[0]} {sector.wind}節 · {sector.tide} · {sector.waves}公尺
        </div>

        {/* Scan sweep or stats row */}
        {scanning ? (
          <div style={{ position: 'relative', height: 3, borderRadius: 'var(--radius-full)', background: 'var(--surface-raised)', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: '33%',
              background: 'linear-gradient(90deg,transparent,var(--data-cyan),transparent)',
              animation: 'a3-sweep 1.1s linear infinite',
            }} />
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)',
          }}>
            <span>檢索到 {rules.length} 條規則</span>
            <span>top-k=3 · ef=128 · 0.18s</span>
          </div>
        )}

        {/* Matched rules */}
        {!scanning && rules.map((r, i) => (
          <RuleMatch
            key={r.id}
            ruleId={r.id}
            text={r.text}
            similarity={r.sim}
            tone={r.tone}
            source={r.src}
            index={i + 1}
            latency={r.latency}
          />
        ))}
      </Card>

      {/* ── Desktop: recommendation at bottom ───────────────────── */}
      {!mobile && !scanning && (
        <Alert
          tone={recTone}
          eyebrow="AI 建議 · LLM 綜合研判"
          title={sector.rec.title}
          icon={<Ico n="navigation" />}
          action={<>
            <Button size="sm" variant="primary">確認</Button>
            <Button size="sm" variant="ghost">發布警報</Button>
          </>}
        >
          {sector.rec.body}
        </Alert>
      )}
    </div>
  );
}



/* dangerColor — inline copy (camelCase not exposed on DS namespace) */
function dangerColor(score) {
  const stops = [
    { v: 0.0,  c: [20,  100, 255] },
    { v: 2.5,  c: [0,   255, 255] },
    { v: 5.0,  c: [255, 255,   0] },
    { v: 7.5,  c: [255, 140,   0] },
    { v: 10.0, c: [255,  30,  30] },
  ];
  const s = Math.max(0, Math.min(10, score));
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (s >= stops[i].v && s <= stops[i + 1].v) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const t = hi.v === lo.v ? 0 : (s - lo.v) / (hi.v - lo.v);
  const ch = (k) => Math.round(lo.c[k] + (hi.c[k] - lo.c[k]) * t);
  return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
}

/* ══════════════════════════════════════════════════════════
   SECTOR DATA — CWA coastal stations around Taiwan
   ══════════════════════════════════════════════════════════ */
const RAW_SECTORS = [
  {
    id: 'pengjia', name: '彭佳嶼', station: 'C0PJ01', coord: '25.63°N 122.08°E',
    x: 64, y: 24, danger: 7.4,
    wind: '8.5', windDir: '東北 · 陣風 11.2', waves: '3.2', tide: '退潮', current: '1.4',
    rules: [
      { id: '規則 #042', sim: 0.94, tone: 'crit', src: 'CWA-2019-PJ', latency: '0.18s', text: '東北風 > 7 節 + 退潮 = 12 公尺以下船舶翻覆風險偏高。' },
      { id: '規則 #017', sim: 0.88, tone: 'warn', src: 'CMS-SWELL-7', latency: '0.21s', text: '40 公里內偵測到外海湧浪碰撞 — 80% 動能轉移至海岸。' },
      { id: '規則 #103', sim: 0.79, tone: 'cyan', src: 'IDW-PM-SPEC', latency: '0.24s', text: 'Pierson-Moskowitz 頻譜推算：持續東北流場確認 3 公尺以上浪場。' },
    ],
    rec: { title: '延後出港 3–6 小時', body: '彭佳嶼外海東北湧浪與退潮洋流碰撞，使 12 公尺以下船舶翻覆風險升至「高」。建議小型船舶留港；於 18:00（UTC+8）重新評估。' },
  },
  {
    id: 'sandiao', name: '三貂角', station: 'C0A970', coord: '25.01°N 122.00°E',
    x: 58, y: 40, danger: 5.2,
    wind: '6.1', windDir: '東北東 · 陣風 8.4', waves: '2.4', tide: '平潮', current: '0.9',
    rules: [
      { id: '規則 #028', sim: 0.86, tone: 'warn', src: 'CWA-2021-SD', latency: '0.19s', text: '東北東 5–7 節 + 平潮 = 岬角附近中等浪群；持續監測波浪週期。' },
      { id: '規則 #061', sim: 0.74, tone: 'cyan', src: 'IDW-PM-SPEC', latency: '0.22s', text: '岬角繞射在三貂角聚集波浪能量。' },
    ],
    rec: { title: '岬角周邊注意', body: '三貂角岬角因繞射形成中等浪群。12 公尺以上船舶可通行；建議小型船舶與岬角保持 0.5 浬以上距離。' },
  },
  {
    id: 'tamsui', name: '淡水觀海', station: 'C0AJ30', coord: '25.18°N 121.41°E',
    x: 38, y: 30, danger: 6.2,
    wind: '4.4', windDir: '西南西 · 陣風 13.5', waves: '2.7', tide: '漲潮', current: '1.1',
    rules: [
      { id: '規則 #055', sim: 0.83, tone: 'warn', src: 'CWA-2020-TS', latency: '0.20s', text: '河口逕流 + 漲潮在出海口形成交錯亂浪。' },
      { id: '規則 #019', sim: 0.71, tone: 'cyan', src: 'GUST-MODEL', latency: '0.23s', text: '陣風係數 > 持續風速 3 倍，研判颮線不穩定。' },
    ],
    rec: { title: '注意河口亂浪', body: '漲潮頂托淡水河口逕流，在出海口形成短而陡的交錯亂浪。建議於平潮時段通過；實測陣風達 13.5 節。' },
  },
  {
    id: 'houbihu', name: '後壁湖', station: 'C0R880', coord: '21.95°N 120.75°E',
    x: 30, y: 82, danger: 2.1,
    wind: '3.6', windDir: '南 · 平靜', waves: '1.2', tide: '漲潮', current: '0.5',
    rules: [
      { id: '規則 #007', sim: 0.90, tone: 'ok', src: 'CWA-2022-HB', latency: '0.16s', text: '南風 < 5 節 + 遮蔽灣澳 = 條件正常；例行作業放行。' },
    ],
    rec: { title: '海況正常', body: '南部遮蔽灣澳，輕南風，浪高 1.2 公尺。後壁湖各級船舶均可正常作業。' },
  },
  {
    id: 'jialeshui', name: '佳樂水', station: 'C0R680', coord: '21.99°N 120.85°E',
    x: 44, y: 88, danger: 4.0,
    wind: '5.5', windDir: '東南 · 陣風 9.1', waves: '2.0', tide: '退潮', current: '0.8',
    rules: [
      { id: '規則 #034', sim: 0.80, tone: 'warn', src: 'CWA-2021-JL', latency: '0.21s', text: '東南湧浪於外露礁岸在低潮時形成捲浪。' },
    ],
    rec: { title: '礁岸碎浪警示', body: '東南湧浪於退潮時撞擊佳樂水外露礁岸，預期出現捲浪。請休閒船舶遠離礁線。' },
  },
];


/* ══════════════════════════════════════════════════════════
   BOTTOM NAVIGATION (mobile only)
   ══════════════════════════════════════════════════════════ */
function BottomNav({ view, onView, alertCount }) {
  const items = [
    { id: 'map',      icon: 'map',      label: '地圖' },
    { id: 'telemetry',icon: 'activity', label: '遙測' },
    { id: 'intel',    icon: 'cpu',      label: '情報' },
    { id: 'alerts',   icon: 'bell',     label: '警報', badge: alertCount },
  ];

  return (
    <nav style={{
      flexShrink: 0,
      background: 'var(--surface-panel)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {items.map((item) => {
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onView(item.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 5, padding: '10px 0 8px',
              minHeight: 56,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 140ms ease',
              position: 'relative',
            }}
          >
            <Ico n={item.icon} s={{ width: 22, height: 22 }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={{
                position: 'absolute', top: 8, right: '50%', marginRight: -20,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--crit)',
                color: 'white', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTOR FLOAT CARD — shown on map view over selected sector
   ══════════════════════════════════════════════════════════ */
function SectorFloatCard({ sector, onTelemetry }) {
  const dangerTone = sector.danger >= 7.5 ? 'var(--crit-text)' : sector.danger >= 5 ? 'var(--warn-text)' : 'var(--ok-text)';
  const dangerBg   = sector.danger >= 7.5 ? 'var(--crit-soft)'  : sector.danger >= 5 ? 'var(--warn-soft)'  : 'var(--ok-soft)';
  const dangerBdr  = sector.danger >= 7.5 ? 'var(--crit-border)': sector.danger >= 5 ? 'var(--warn-border)': 'var(--ok-border)';

  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 12, right: 12,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid var(--border-glass)',
      borderRadius: 16,
      padding: '14px 16px',
      zIndex: 20,
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: 'var(--shadow-glass)',
      animation: 'panelIn 220ms var(--ease-out)',
    }}>
      {/* Danger score badge */}
      <div style={{
        width: 52, height: 52, borderRadius: 13,
        background: dangerBg,
        border: `1.5px solid ${dangerBdr}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, gap: 1,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
          color: dangerTone, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>{sector.danger.toFixed(1)}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: dangerTone, letterSpacing: '0.06em' }}>
          {sector.danger >= 7.5 ? '高' : sector.danger >= 5 ? '中' : '低'}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{sector.name}</div>
        <div style={{
          fontSize: 12, color: 'var(--text-muted)', marginTop: 4,
          display: 'flex', gap: 10, flexWrap: 'wrap',
        }}>
          <span>🌊 {sector.waves}m</span>
          <span>💨 {sector.wind}節</span>
          <span>〽 {sector.tide}</span>
        </div>
      </div>

      {/* Detail button */}
      <button
        onClick={onTelemetry}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-soft)',
          border: '1px solid var(--border-accent)',
          cursor: 'pointer', flexShrink: 0, color: 'var(--accent)',
        }}
      >
        <Ico n="chevron-right" s={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ALERTS VIEW (mobile)
   ══════════════════════════════════════════════════════════ */
function AlertsView({ sectors, onSelect, onView }) {
  const critical = sectors.filter((s) => s.danger >= 7.5);
  const warning  = sectors.filter((s) => s.danger >= 5 && s.danger < 7.5);
  const normal   = sectors.filter((s) => s.danger < 5);

  const all = [
    ...critical.map((s) => ({ ...s, tier: 'crit' })),
    ...warning.map((s)  => ({ ...s, tier: 'warn' })),
    ...normal.map((s)   => ({ ...s, tier: 'ok' })),
  ];

  const tierStyle = {
    crit: { bg: 'var(--crit-soft)',  border: 'var(--crit-border)',  text: 'var(--crit-text)',  label: '緊急' },
    warn: { bg: 'var(--warn-soft)',  border: 'var(--warn-border)',  text: 'var(--warn-text)',  label: '警示' },
    ok:   { bg: 'var(--ok-soft)',    border: 'var(--ok-border)',    text: 'var(--ok-text)',    label: '正常' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { tier: 'crit', count: critical.length },
          { tier: 'warn', count: warning.length },
          { tier: 'ok',   count: normal.length },
        ].map(({ tier, count }) => {
          const ts = tierStyle[tier];
          return (
            <div key={tier} style={{
              background: ts.bg, border: `1px solid ${ts.border}`,
              borderRadius: 14, padding: '16px 0',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 34,
                fontWeight: 700, color: ts.text, lineHeight: 1,
              }}>{count}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: ts.text, marginTop: 6 }}>{ts.label}</div>
            </div>
          );
        })}
      </div>

      {/* Sector list */}
      {all.map((s) => {
        const ts = tierStyle[s.tier];
        return (
          <button
            key={s.id}
            onClick={() => { onSelect(s.id); onView('map'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px', width: '100%',
              background: 'var(--surface-panel)',
              border: `1px solid ${s.tier === 'ok' ? 'var(--border-subtle)' : ts.border}`,
              borderRadius: 14, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: s.color, boxShadow: `0 0 8px ${s.color}`,
              flexShrink: 0,
              animation: s.tier === 'crit' ? 'a3-breathe 1.8s ease infinite' : 'none',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                浪高 {s.waves}m · 風速 {s.wind}節 · {s.tide}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 24,
              fontWeight: 700, color: s.color,
              fontVariantNumeric: 'tabular-nums',
            }}>{s.danger.toFixed(1)}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MOBILE LAYOUT
   ══════════════════════════════════════════════════════════ */
function MobileApp({ sectors, sector, selectedId, scanning, clock, mobileView, setMobileView, runScan }) {
  const alertCount = sectors.filter((s) => s.danger >= 7.5).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--surface-base)' }}>
      <Header clock={clock} compact />

      {/* Content area — flex column so children can use flex:1 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* MAP — always mounted, shown/hidden via display so GeospatialCanvas keeps state */}
        <div style={{
          display: mobileView === 'map' ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1, minHeight: 0,
          position: 'relative',
        }}>
          <GeospatialCanvas
            sectors={sectors} selectedId={selectedId}
            onSelect={(id) => { runScan(id); }}
            scanning={scanning} mobile
          />
          {!scanning && (
            <SectorFloatCard
              sector={sector}
              onTelemetry={() => setMobileView('telemetry')}
            />
          )}
        </div>

        {/* TELEMETRY */}
        {mobileView === 'telemetry' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, animation: 'panelIn 220ms var(--ease-out)' }} className="a3-scroll">
            <TelemetryRail
              sector={sector} sectors={sectors}
              selectedId={selectedId} onSelect={(id) => { runScan(id); setMobileView('map'); }}
              mobile
            />
          </div>
        )}

        {/* INTEL / RAG */}
        {mobileView === 'intel' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, animation: 'panelIn 220ms var(--ease-out)' }} className="a3-scroll">
            <RagFeed sector={sector} scanning={scanning} onRerun={() => runScan(selectedId)} mobile />
          </div>
        )}

        {/* ALERTS */}
        {mobileView === 'alerts' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, animation: 'panelIn 220ms var(--ease-out)' }} className="a3-scroll">
            <AlertsView sectors={sectors} onSelect={runScan} onView={setMobileView} />
          </div>
        )}
      </div>

      <BottomNav view={mobileView} onView={setMobileView} alertCount={alertCount} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TABLET LAYOUT (768–1199px)
   ══════════════════════════════════════════════════════════ */
function TabletApp({ sectors, sector, selectedId, scanning, clock, runScan }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--surface-base)' }}>
      <Header clock={clock} />
      <main style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12, padding: 12 }}>
        <GeospatialCanvas sectors={sectors} selectedId={selectedId} onSelect={runScan} scanning={scanning} />
        <div style={{ width: 300, flexShrink: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }} className="a3-scroll">
          <RagFeed sector={sector} scanning={scanning} onRerun={() => runScan(selectedId)} />
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DESKTOP LAYOUT (1200px+)
   ══════════════════════════════════════════════════════════ */
function DesktopApp({ sectors, sector, selectedId, scanning, clock, runScan }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--surface-base)' }}>
      <Header clock={clock} />
      <main style={{ flex: 1, minHeight: 0, display: 'flex', gap: 'var(--gap-grid)', padding: 'var(--gap-grid)' }}>
        <TelemetryRail sector={sector} sectors={sectors} selectedId={selectedId} onSelect={runScan} />
        <GeospatialCanvas sectors={sectors} selectedId={selectedId} onSelect={runScan} scanning={scanning} />
        <RagFeed sector={sector} scanning={scanning} onRerun={() => runScan(selectedId)} />
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT APP — detects layout, delegates to sub-apps
   ══════════════════════════════════════════════════════════ */
function App() {
  const getLayout = () => {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1200) return 'tablet';
    return 'desktop';
  };

  const [selectedId,  setSelectedId]  = React.useState('pengjia');
  const [scanning,    setScanning]    = React.useState(false);
  const [clock,       setClock]       = React.useState('--:--:--');
  const [mobileView,  setMobileView]  = React.useState('map');
  const [layout,      setLayout]      = React.useState(getLayout);

  /* Restore last selected sector from localStorage */
  React.useEffect(() => {
    const saved = localStorage.getItem('a3-selected-sector');
    if (saved) setSelectedId(saved);
  }, []);

  /* Persist selected sector */
  React.useEffect(() => {
    localStorage.setItem('a3-selected-sector', selectedId);
  }, [selectedId]);

  /* Clock */
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString('zh-TW', { hour12: false }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  /* Responsive layout detection */
  React.useEffect(() => {
    const handle = () => setLayout(getLayout());
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);



  /* Enrich sectors with computed color */
  const sectors = React.useMemo(
    () => RAW_SECTORS.map((s) => ({ ...s, color: dangerColor(s.danger) })),
    []
  );
  const sector = sectors.find((s) => s.id === selectedId) || sectors[0];

  /* Scan handler */
  const runScan = React.useCallback((id) => {
    setSelectedId(id);
    setScanning(true);
    setTimeout(() => setScanning(false), 1100);
  }, []);

  const shared = { sectors, sector, selectedId, scanning, clock, runScan };

  if (layout === 'mobile')  return <MobileApp  {...shared} mobileView={mobileView} setMobileView={setMobileView} />;
  if (layout === 'tablet')  return <TabletApp  {...shared} />;
  return                           <DesktopApp {...shared} />;
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div style={{color:'#ff8080', background:'#111', padding:20, position:'absolute', inset:0, fontFamily:'monospace', overflow:'auto'}}>
        <h3>React Render Error</h3>
        <pre>{this.state.error.toString()}</pre>
        <pre>{this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<ErrorBoundary><App /></ErrorBoundary>);


