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

window.GeospatialCanvas = GeospatialCanvas;
