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

window.RagFeed = RagFeed;
