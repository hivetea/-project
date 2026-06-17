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

window.Header = Header;
