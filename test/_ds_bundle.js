/* @ds-bundle: {"format":3,"namespace":"A3MaritimeIntelligenceDesignSystem_4ef093","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Alert","sourcePath":"components/intel/Alert.jsx"},{"name":"RuleMatch","sourcePath":"components/intel/RuleMatch.jsx"},{"name":"RiskMeter","sourcePath":"components/telemetry/RiskMeter.jsx"},{"name":"StatusBadge","sourcePath":"components/telemetry/StatusBadge.jsx"},{"name":"TelemetryStat","sourcePath":"components/telemetry/TelemetryStat.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"116bd22f1f33","components/core/Button.jsx":"1c42e579cc42","components/core/Card.jsx":"bfea4402b3d7","components/intel/Alert.jsx":"ce4cd6954b30","components/intel/RuleMatch.jsx":"8a780f2e3fb1","components/telemetry/RiskMeter.jsx":"48c9cebe1387","components/telemetry/StatusBadge.jsx":"d8d76f71c431","components/telemetry/TelemetryStat.jsx":"7ec8891a12a5","ui_kits/dashboard/GeospatialCanvas.jsx":"108c903f9c7b","ui_kits/dashboard/Header.jsx":"061fb8e6f4f8","ui_kits/dashboard/RagFeed.jsx":"3126c03455be","ui_kits/dashboard/TelemetryRail.jsx":"bfaff10679f1","ui_kits/dashboard/sw.js":"2b0206ce78eb"},"inlinedExternals":[],"unexposedExports":[{"name":"dangerColor","sourcePath":"components/telemetry/RiskMeter.jsx"}]} */

(() => {

const __ds_ns = (window.A3MaritimeIntelligenceDesignSystem_4ef093 = window.A3MaritimeIntelligenceDesignSystem_4ef093 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Compact status/category label. Soft-tinted fills with a tactical
 * uppercase option and an optional leading status dot.
 */
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  uppercase = false,
  style = {},
  ...rest
}) {
  const TONES = {
    neutral: {
      bg: 'var(--surface-raised)',
      fg: 'var(--text-secondary)',
      bd: 'var(--border-default)',
      dot: 'var(--slate-500)'
    },
    accent: {
      bg: 'var(--accent-soft)',
      fg: 'var(--teal-300)',
      bd: 'var(--border-accent)',
      dot: 'var(--accent)'
    },
    cyan: {
      bg: 'var(--data-cyan-soft)',
      fg: 'var(--cyan-300)',
      bd: 'rgba(34,211,238,0.35)',
      dot: 'var(--data-cyan)'
    },
    warn: {
      bg: 'var(--warn-soft)',
      fg: 'var(--warn-text)',
      bd: 'var(--warn-border)',
      dot: 'var(--warn)'
    },
    crit: {
      bg: 'var(--crit-soft)',
      fg: 'var(--crit-text)',
      bd: 'var(--crit-border)',
      dot: 'var(--crit)'
    },
    ok: {
      bg: 'var(--ok-soft)',
      fg: 'var(--ok-text)',
      bd: 'var(--ok-border)',
      dot: 'var(--ok)'
    }
  };
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: uppercase ? '3px 9px' : '3px 10px',
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: uppercase ? 'var(--tracking-wide)' : '0.01em',
      textTransform: uppercase ? 'uppercase' : 'none',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.dot,
      flexShrink: 0
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '6px 12px',
    fontSize: 'var(--text-xs)',
    gap: '6px',
    icon: 14,
    height: '30px'
  },
  md: {
    padding: '9px 16px',
    fontSize: 'var(--text-sm)',
    gap: '8px',
    icon: 16,
    height: '38px'
  },
  lg: {
    padding: '12px 22px',
    fontSize: 'var(--text-base)',
    gap: '10px',
    icon: 18,
    height: '46px'
  }
};
const VARIANTS = {
  primary: {
    base: {
      background: 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid var(--accent)'
    },
    hover: {
      background: 'var(--accent-hover)',
      borderColor: 'var(--accent-hover)',
      boxShadow: 'var(--glow-accent)'
    },
    active: {
      background: 'var(--accent-press)',
      borderColor: 'var(--accent-press)'
    }
  },
  secondary: {
    base: {
      background: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-default)'
    },
    hover: {
      background: 'var(--slate-700)',
      borderColor: 'var(--border-strong)'
    },
    active: {
      background: 'var(--slate-800)'
    }
  },
  ghost: {
    base: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    hover: {
      background: 'var(--surface-hover)',
      color: 'var(--text-primary)'
    },
    active: {
      background: 'var(--surface-active)'
    }
  },
  danger: {
    base: {
      background: 'var(--crit-soft)',
      color: 'var(--crit-text)',
      border: '1px solid var(--crit-border)'
    },
    hover: {
      background: 'rgba(244,63,94,0.20)',
      boxShadow: 'var(--glow-crit)'
    },
    active: {
      background: 'rgba(244,63,94,0.28)'
    }
  }
};

/**
 * A3 primary action button. Oceanic-teal primary, slate secondary,
 * minimal ghost, and a soft-rose danger variant.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sz.gap,
    height: sz.height,
    padding: sz.padding,
    fontFamily: 'var(--font-sans)',
    fontSize: sz.fontSize,
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1,
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    transform: active && !disabled ? 'translateY(1px)' : 'none',
    whiteSpace: 'nowrap',
    ...v.base,
    ...(hover && !disabled ? v.hover : {}),
    ...(active && !disabled ? v.active : {}),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: composed
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: sz.icon,
      height: sz.icon
    }
  }, icon) : null, children, iconRight ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: sz.icon,
      height: sz.icon
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface container. `solid` = slate panel (crisp text, static rails);
 * `glass` = backdrop-blurred floating panel for overlaying the map.
 * Optional uppercase eyebrow + right-aligned header action slot.
 */
function Card({
  children,
  variant = 'solid',
  eyebrow = null,
  title = null,
  action = null,
  padding = 'var(--pad-card)',
  style = {},
  bodyStyle = {},
  ...rest
}) {
  const base = variant === 'glass' ? {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: 'var(--glass-border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-glass)'
  } : {
    background: 'var(--surface-panel)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)'
  };
  const hasHeader = eyebrow || title || action;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      ...base,
      ...style
    }
  }, rest), hasHeader ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '12px',
      padding: `${padding} ${padding} 0`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: 0
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      lineHeight: 'var(--leading-snug)'
    }
  }, title) : null), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action) : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      ...bodyStyle
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/intel/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Prominent alert / recommendation box. `crit` and `warn` for hazard
 * callouts; `recommend` is the accent-bordered LLM actionable-output box.
 */
function Alert({
  tone = 'recommend',
  eyebrow = null,
  title = null,
  icon = null,
  action = null,
  children,
  glow = true,
  style = {},
  ...rest
}) {
  const TONES = {
    recommend: {
      bar: 'var(--accent)',
      bg: 'var(--accent-soft)',
      bd: 'var(--border-accent)',
      fg: 'var(--teal-300)',
      glow: 'var(--glow-accent)'
    },
    info: {
      bar: 'var(--data-cyan)',
      bg: 'var(--data-cyan-soft)',
      bd: 'rgba(34,211,238,0.35)',
      fg: 'var(--cyan-300)',
      glow: 'var(--glow-cyan)'
    },
    warn: {
      bar: 'var(--warn)',
      bg: 'var(--warn-soft)',
      bd: 'var(--warn-border)',
      fg: 'var(--warn-text)',
      glow: 'var(--glow-warn)'
    },
    crit: {
      bar: 'var(--crit)',
      bg: 'var(--crit-soft)',
      bd: 'var(--crit-border)',
      fg: 'var(--crit-text)',
      glow: 'var(--glow-crit)'
    }
  };
  const t = TONES[tone] || TONES.recommend;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      display: 'flex',
      gap: '14px',
      padding: 'var(--pad-card)',
      paddingLeft: 'calc(var(--pad-card) + 3px)',
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: glow ? t.glow : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 3,
      background: t.bar
    }
  }), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0,
      width: 20,
      height: 20,
      color: t.fg,
      marginTop: 1
    }
  }, icon) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minWidth: 0,
      flex: 1
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: t.fg
    }
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      lineHeight: 'var(--leading-snug)'
    }
  }, title) : null, children ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '6px',
      display: 'flex',
      gap: '8px'
    }
  }, action) : null));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/intel/Alert.jsx", error: String((e && e.message) || e) }); }

// components/intel/RuleMatch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RAG retrieval feed item — a matched historical rule with id, similarity
 * score bar, rule text, and retrieval metadata. The core unit of the
 * "Captain's Log Vector Retrieval" feed.
 */
function RuleMatch({
  ruleId,
  text,
  similarity = 0.9,
  tone = 'warn',
  source = null,
  latency = null,
  index = null,
  style = {},
  ...rest
}) {
  const TONES = {
    warn: 'var(--warn)',
    crit: 'var(--crit)',
    cyan: 'var(--data-cyan)',
    accent: 'var(--accent)',
    ok: 'var(--ok)'
  };
  const dotColor = TONES[tone] || TONES.warn;
  const pct = Math.round(Math.max(0, Math.min(1, similarity)) * 100);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: 'var(--pad-compact) var(--space-4)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      animation: 'a3-feed-in var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: dotColor,
      boxShadow: `0 0 8px ${dotColor}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)'
    }
  }, "\u547D\u4E2D ", ruleId), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, "cos-sim ", similarity.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--leading-snug)'
    }
  }, text), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-base)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      background: dotColor,
      borderRadius: 'var(--radius-full)'
    }
  })), source || latency || index ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      color: 'var(--text-faint)'
    }
  }, index ? /*#__PURE__*/React.createElement("span", null, "#", index) : null, source ? /*#__PURE__*/React.createElement("span", null, "src ", source) : null, latency ? /*#__PURE__*/React.createElement("span", null, "\xB7 ", latency) : null) : null);
}
Object.assign(__ds_scope, { RuleMatch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/intel/RuleMatch.jsx", error: String((e && e.message) || e) }); }

// components/telemetry/RiskMeter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Map a 0–10 danger score to the production gradient color. */
function dangerColor(score) {
  const stops = [{
    v: 0.0,
    c: [20, 100, 255]
  }, {
    v: 2.5,
    c: [0, 255, 255]
  }, {
    v: 5.0,
    c: [255, 255, 0]
  }, {
    v: 7.5,
    c: [255, 140, 0]
  }, {
    v: 10.0,
    c: [255, 30, 30]
  }];
  const s = Math.max(0, Math.min(10, score));
  let lo = stops[0],
    hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (s >= stops[i].v && s <= stops[i + 1].v) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const t = hi.v === lo.v ? 0 : (s - lo.v) / (hi.v - lo.v);
  const ch = i => Math.round(lo.c[i] + (hi.c[i] - lo.c[i]) * t);
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}
const LABELS = [{
  max: 2.5,
  text: '低'
}, {
  max: 5.0,
  text: '中等'
}, {
  max: 7.5,
  text: '偏高'
}, {
  max: 10.1,
  text: '高'
}];

/**
 * Danger-index meter (0–10) using the signature gradient track with a
 * value marker and severity label — the brand way to show risk.
 */
function RiskMeter({
  value = 0,
  label = '危險指數',
  showScale = true,
  style = {},
  ...rest
}) {
  const v = Math.max(0, Math.min(10, value));
  const pct = v / 10 * 100;
  const color = dangerColor(v);
  const severity = (LABELS.find(l => v < l.max) || LABELS[LABELS.length - 1]).text;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, v.toFixed(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-wide)',
      color
    }
  }, severity))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 10,
      borderRadius: 'var(--radius-full)',
      background: 'var(--danger-scale)',
      boxShadow: 'var(--inset-well)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: `${pct}%`,
      transform: 'translate(-50%, -50%)',
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: color,
      border: '2.5px solid var(--surface-base)',
      boxShadow: `0 0 10px ${color}`
    }
  })), showScale ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, [0, 2.5, 5, 7.5, 10].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      color: 'var(--text-faint)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, n.toFixed(1)))) : null);
}
Object.assign(__ds_scope, { dangerColor, RiskMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/telemetry/RiskMeter.jsx", error: String((e && e.message) || e) }); }

// components/telemetry/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Live system-status badge with a pulsing dot — e.g. "AI Engine: Online".
 * Tone drives both the dot color and its glow.
 */
function StatusBadge({
  label = 'AI 引擎',
  status = '上線',
  tone = 'ok',
  pulse = true,
  style = {},
  ...rest
}) {
  const TONES = {
    ok: {
      dot: 'var(--ok)',
      glow: 'var(--glow-ok)',
      text: 'var(--ok-text)',
      bd: 'var(--ok-border)',
      bg: 'var(--ok-soft)'
    },
    warn: {
      dot: 'var(--warn)',
      glow: 'var(--glow-warn)',
      text: 'var(--warn-text)',
      bd: 'var(--warn-border)',
      bg: 'var(--warn-soft)'
    },
    crit: {
      dot: 'var(--crit)',
      glow: 'var(--glow-crit)',
      text: 'var(--crit-text)',
      bd: 'var(--crit-border)',
      bg: 'var(--crit-soft)'
    },
    idle: {
      dot: 'var(--slate-500)',
      glow: 'none',
      text: 'var(--text-muted)',
      bd: 'var(--border-default)',
      bg: 'var(--surface-raised)'
    }
  };
  const t = TONES[tone] || TONES.ok;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '5px 12px 5px 10px',
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      width: 8,
      height: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: t.dot,
      boxShadow: t.glow,
      animation: pulse ? 'a3-pulse var(--dur-pulse) var(--ease-in-out) infinite' : 'none'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-medium)'
    }
  }, label, ":"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: t.text,
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '0.02em'
    }
  }, status));
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/telemetry/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/telemetry/TelemetryStat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Normalized sensor readout — uppercase label, large mono value with unit,
 * optional icon and sub-detail (e.g. bearing or trend). Built for the
 * left telemetry rail.
 */
function TelemetryStat({
  label,
  value,
  unit = '',
  detail = null,
  icon = null,
  tone = 'cyan',
  style = {},
  ...rest
}) {
  const VAL = {
    cyan: 'var(--data-cyan)',
    accent: 'var(--accent)',
    warn: 'var(--warn-text)',
    crit: 'var(--crit-text)',
    plain: 'var(--text-primary)'
  };
  const valueColor = VAL[tone] || VAL.cyan;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: 'var(--pad-compact) var(--space-4)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 15,
      height: 15,
      color: 'var(--text-faint)'
    }
  }, icon) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '5px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-semibold)',
      color: valueColor,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-medium)'
    }
  }, unit) : null), detail ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)'
    }
  }, detail) : null);
}
Object.assign(__ds_scope, { TelemetryStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/telemetry/TelemetryStat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/GeospatialCanvas.jsx
try { (() => {
/* global React */

/* ── Ref-based Lucide icon (avoids React reconciler conflict) ── */
function Ico({
  n,
  s
}) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !window.lucide) return;
    const wrap = document.createElement('div');
    const el = document.createElement('i');
    el.setAttribute('data-lucide', n);
    wrap.appendChild(el);
    lucide.createIcons({
      nodes: [wrap]
    });
    const svg = wrap.querySelector('svg');
    if (svg) {
      ref.current.innerHTML = '';
      ref.current.appendChild(svg);
    }
  }, [n]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...s
    }
  });
}

/**
 * GeospatialCanvas — dark-grid tactical map.
 * Clicking / tapping a sector node selects it.
 * mobile=true  → larger tap targets (44px+), simplified legend
 */
function GeospatialCanvas({
  sectors,
  selectedId,
  onSelect,
  scanning,
  mobile = false
}) {
  const {
    Badge
  } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  /* dangerColor — inline (camelCase not on DS namespace) */
  function dangerColor(score) {
    const stops = [{
      v: 0.0,
      c: [20, 100, 255]
    }, {
      v: 2.5,
      c: [0, 255, 255]
    }, {
      v: 5.0,
      c: [255, 255, 0]
    }, {
      v: 7.5,
      c: [255, 140, 0]
    }, {
      v: 10.0,
      c: [255, 30, 30]
    }];
    const s = Math.max(0, Math.min(10, score));
    let lo = stops[0],
      hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (s >= stops[i].v && s <= stops[i + 1].v) {
        lo = stops[i];
        hi = stops[i + 1];
        break;
      }
    }
    const t = hi.v === lo.v ? 0 : (s - lo.v) / (hi.v - lo.v);
    const ch = k => Math.round(lo.c[k] + (hi.c[k] - lo.c[k]) * t);
    return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "a3-grid-bg--map a3-scroll",
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 0,
      borderRadius: mobile ? 0 : 'var(--radius-lg)',
      border: mobile ? 'none' : '1px solid var(--border-subtle)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '46%',
      top: '40%',
      width: 0,
      height: 0
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 220,
      height: 220,
      marginLeft: -110,
      marginTop: -110,
      borderRadius: '50%',
      border: '1.5px solid rgba(34,211,238,0.45)',
      animation: `a3-radar 3.6s var(--ease-out) ${i * 1.2}s infinite`
    }
  }))), sectors.map(s => {
    const color = dangerColor(s.danger);
    const isSel = s.id === selectedId;
    const DOT = mobile ? isSel ? 22 : 18 : isSel ? 18 : 13;
    const HIT = mobile ? 52 : 36; // Tap / click target size

    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => onSelect(s.id),
      "aria-label": `選擇 ${s.name}，危險指數 ${s.danger.toFixed(1)}`,
      style: {
        position: 'absolute',
        left: `${s.x}%`,
        top: `${s.y}%`,
        transform: 'translate(-50%, -50%)',
        width: HIT,
        height: HIT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        zIndex: isSel ? 5 : 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: DOT,
        height: DOT,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${isSel ? 20 : 10}px ${color}`,
        border: isSel ? '2.5px solid var(--surface-base)' : '2px solid rgba(2,6,23,0.55)',
        transition: 'all var(--dur-base) var(--ease-out)',
        animation: s.danger >= 7.5 ? 'a3-breathe 1.8s var(--ease-out) infinite' : 'none',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: mobile ? 11 : 10,
        whiteSpace: 'nowrap',
        padding: '2px 6px',
        borderRadius: 'var(--radius-xs)',
        background: 'rgba(2,6,23,0.75)',
        color: isSel ? 'var(--text-primary)' : 'var(--text-muted)',
        border: `1px solid ${isSel ? 'var(--border-accent)' : 'transparent'}`,
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none'
      }
    }, s.name));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '12%',
      top: '22%',
      transform: 'translate(0,-50%)',
      zIndex: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '6px 12px',
      background: 'rgba(244,63,94,0.14)',
      border: '1px solid var(--crit-border)',
      borderRadius: 'var(--radius-full)',
      backdropFilter: 'blur(6px)',
      boxShadow: 'var(--glow-crit)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "triangle-alert",
    s: {
      width: 13,
      height: 13,
      color: 'var(--crit-text)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--crit-text)',
      whiteSpace: 'nowrap'
    }
  }, "\u760B\u72D7\u6D6A\u5371\u96AA\u5340"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 14,
      top: 14,
      zIndex: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: scanning ? 'cyan' : 'accent',
    dot: true,
    uppercase: true
  }, scanning ? '掃描區段中…' : '即時 · 115 觀測站')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 14,
      bottom: mobile ? 14 : 80,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      zIndex: 6
    }
  }, ['plus', 'minus'].map((n, i) => /*#__PURE__*/React.createElement("button", {
    key: n,
    "aria-label": n === 'plus' ? '放大' : '縮小',
    style: {
      width: mobile ? 40 : 32,
      height: mobile ? 40 : 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(8px)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-glass)',
      cursor: 'pointer',
      borderRadius: i === 0 ? 'var(--radius-sm) var(--radius-sm) 0 0' : '0 0 var(--radius-sm) var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: n,
    s: {
      width: 15,
      height: 15
    }
  })))), !mobile && /*#__PURE__*/React.createElement("div", {
    className: "a3-glass",
    style: {
      position: 'absolute',
      left: 14,
      bottom: 14,
      padding: '12px 14px',
      width: 224,
      borderRadius: 'var(--radius-md)',
      zIndex: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, "\u5371\u96AA\u6307\u6578 0\u201310"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 'var(--radius-full)',
      background: 'var(--danger-scale)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 5
    }
  }, [0, 2.5, 5, 7.5, 10].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      color: 'var(--text-faint)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, n.toFixed(1))))), mobile && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 14,
      padding: '8px 12px',
      background: 'rgba(2,6,23,0.75)',
      backdropFilter: 'blur(8px)',
      border: '1px solid var(--border-glass)',
      borderRadius: 10,
      zIndex: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 6,
      borderRadius: 3,
      background: 'var(--danger-scale)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)'
    }
  }, "\u5371\u96AA 0\u201310")));
}
window.GeospatialCanvas = GeospatialCanvas;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/GeospatialCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Header.jsx
try { (() => {
/* global React */

/* ── Ref-based Lucide icon (avoids React reconciler conflict) ── */
function Ico({
  n,
  s
}) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !window.lucide) return;
    const wrap = document.createElement('div');
    const el = document.createElement('i');
    el.setAttribute('data-lucide', n);
    wrap.appendChild(el);
    lucide.createIcons({
      nodes: [wrap]
    });
    const svg = wrap.querySelector('svg');
    if (svg) {
      ref.current.innerHTML = '';
      ref.current.appendChild(svg);
    }
  }, [n]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...s
    }
  });
}

/**
 * A3 Header — responsive.
 * compact=true  → 48px mobile bar (logo + live dot + clock)
 * compact=false → 60px desktop bar (logo + nav + status + controls)
 */
function Header({
  clock,
  compact = false
}) {
  const {
    StatusBadge
  } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  /* ── Mobile / Compact ────────────────────────────────────── */
  if (compact) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: 48,
        flexShrink: 0,
        background: 'var(--surface-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 30
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--glow-accent)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--text-primary)'
      }
    }, "A3"), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 4,
        right: 4,
        bottom: 4,
        height: 2,
        borderRadius: 2,
        background: 'var(--danger-scale)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.01em'
      }
    }, "\u6D77\u8C61\u60C5\u5831")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--ok)',
        display: 'inline-block',
        animation: 'a3-pulse 2s var(--ease-out) infinite'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--ok-text)',
        fontWeight: 600,
        letterSpacing: '0.04em'
      }
    }, "\u5373\u6642")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, clock)));
  }

  /* ── Desktop ─────────────────────────────────────────────── */
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 var(--space-6)',
      height: 60,
      flexShrink: 0,
      background: 'var(--surface-panel)',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--glow-accent)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--text-primary)',
      letterSpacing: '-0.04em'
    }
  }, "A3"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 6,
      right: 6,
      bottom: 5,
      height: 2.5,
      borderRadius: 2,
      background: 'var(--danger-scale)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)',
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1,
      letterSpacing: '-0.01em'
    }
  }, "A3 \u6D77\u8C61 RAG \u667A\u6167\u60C5\u5831"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, "\u6D77\u8C61\u5730\u5716 \xB7 Smart Maritime Intel"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginLeft: 28
    }
  }, [['作業總覽', true], ['海象預報', false], ['規則庫', false], ['觀測站', false]].map(([t, active]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      padding: '7px 14px',
      fontSize: 'var(--text-sm)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      color: active ? 'var(--text-primary)' : 'var(--text-muted)',
      background: active ? 'var(--surface-raised)' : 'transparent',
      fontWeight: active ? 600 : 400,
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, clock, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "UTC+8")), /*#__PURE__*/React.createElement(StatusBadge, {
    label: "AI \u5F15\u64CE",
    status: "\u4E0A\u7DDA",
    tone: "ok"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "bell",
    s: {
      width: 17,
      height: 17
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "settings",
    s: {
      width: 17,
      height: 17
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-secondary)',
      fontWeight: 600
    }
  }, "OC"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/RagFeed.jsx
try { (() => {
/* global React */

/* ── Ref-based Lucide icon (avoids React reconciler conflict) ── */
function Ico({
  n,
  s
}) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !window.lucide) return;
    const wrap = document.createElement('div');
    const el = document.createElement('i');
    el.setAttribute('data-lucide', n);
    wrap.appendChild(el);
    lucide.createIcons({
      nodes: [wrap]
    });
    const svg = wrap.querySelector('svg');
    if (svg) {
      ref.current.innerHTML = '';
      ref.current.appendChild(svg);
    }
  }, [n]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...s
    }
  });
}

/**
 * RagFeed — RAG retrieval stream + AI recommendation.
 * mobile=true → full-page layout, recommendation first (most important info at top)
 */
function RagFeed({
  sector,
  scanning,
  onRerun,
  mobile = false
}) {
  const {
    Card,
    Alert,
    RuleMatch,
    Button,
    Badge
  } = window.A3MaritimeIntelligenceDesignSystem_4ef093;
  const rules = sector.rules || [];
  const recTone = sector.danger >= 7.5 ? 'crit' : sector.danger >= 5 ? 'warn' : 'recommend';
  const containerStyle = mobile ? {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  } : {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--gap-grid)',
    width: 352,
    flexShrink: 0,
    overflowY: 'auto'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: mobile ? '' : 'a3-scroll',
    style: containerStyle
  }, mobile && !scanning && /*#__PURE__*/React.createElement(Alert, {
    tone: recTone,
    eyebrow: "AI \u5EFA\u8B70 \xB7 LLM \u7D9C\u5408\u7814\u5224",
    title: sector.rec.title,
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "navigation"
    }),
    action: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary"
    }, "\u78BA\u8A8D"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "\u767C\u5E03\u8B66\u5831"))
  }, sector.rec.body), /*#__PURE__*/React.createElement(Card, {
    eyebrow: "\u822A\u6D77\u65E5\u8A8C \xB7 \u5411\u91CF\u6AA2\u7D22",
    title: "RAG \u63A8\u8AD6\u4E32\u6D41",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "refresh-cw",
        s: {
          width: 13,
          height: 13
        }
      }),
      onClick: onRerun
    }, "\u91CD\u65B0\u6AA2\u7D22"),
    bodyStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 12px',
      background: 'var(--surface-base)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "search",
    s: {
      width: 13,
      height: 13,
      color: 'var(--data-cyan)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      marginRight: 4
    }
  }, "\u67E5\u8A62:"), "\u98A8 ", sector.windDir.split(' ')[0], " ", sector.wind, "\u7BC0 \xB7 ", sector.tide, " \xB7 ", sector.waves, "\u516C\u5C3A"), scanning ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 3,
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-raised)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '33%',
      background: 'linear-gradient(90deg,transparent,var(--data-cyan),transparent)',
      animation: 'a3-sweep 1.1s linear infinite'
    }
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u6AA2\u7D22\u5230 ", rules.length, " \u689D\u898F\u5247"), /*#__PURE__*/React.createElement("span", null, "top-k=3 \xB7 ef=128 \xB7 0.18s")), !scanning && rules.map((r, i) => /*#__PURE__*/React.createElement(RuleMatch, {
    key: r.id,
    ruleId: r.id,
    text: r.text,
    similarity: r.sim,
    tone: r.tone,
    source: r.src,
    index: i + 1,
    latency: r.latency
  }))), !mobile && !scanning && /*#__PURE__*/React.createElement(Alert, {
    tone: recTone,
    eyebrow: "AI \u5EFA\u8B70 \xB7 LLM \u7D9C\u5408\u7814\u5224",
    title: sector.rec.title,
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "navigation"
    }),
    action: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary"
    }, "\u78BA\u8A8D"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "\u767C\u5E03\u8B66\u5831"))
  }, sector.rec.body));
}
window.RagFeed = RagFeed;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/RagFeed.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/TelemetryRail.jsx
try { (() => {
/* global React */

/* ── Ref-based Lucide icon (avoids React reconciler conflict) ── */
function Ico({
  n,
  s
}) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !window.lucide) return;
    const wrap = document.createElement('div');
    const el = document.createElement('i');
    el.setAttribute('data-lucide', n);
    wrap.appendChild(el);
    lucide.createIcons({
      nodes: [wrap]
    });
    const svg = wrap.querySelector('svg');
    if (svg) {
      ref.current.innerHTML = '';
      ref.current.appendChild(svg);
    }
  }, [n]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...s
    }
  });
}

/**
 * TelemetryRail — real-time stats + sector watchlist.
 * mobile=true  → full-page vertical card layout (used in mobile panel view)
 * mobile=false → narrow sidebar column (desktop)
 */
function TelemetryRail({
  sector,
  sectors,
  selectedId,
  onSelect,
  mobile = false
}) {
  const {
    Card,
    TelemetryStat,
    RiskMeter,
    Badge
  } = window.A3MaritimeIntelligenceDesignSystem_4ef093;
  const waveWarn = parseFloat(sector.waves) >= 3;
  const containerStyle = mobile ? {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  } : {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--gap-grid)',
    width: 296,
    flexShrink: 0,
    overflowY: 'auto'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: mobile ? '' : 'a3-scroll',
    style: containerStyle
  }, /*#__PURE__*/React.createElement(Card, {
    eyebrow: "\u5373\u6642\u9059\u6E2C",
    title: sector.name,
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "ok",
      dot: true
    }, "\u5373\u6642")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: -4,
      marginBottom: 14,
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "map-pin"
  }), sector.coord, " \xB7 ", sector.station), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: mobile ? 12 : 10
    }
  }, /*#__PURE__*/React.createElement(TelemetryStat, {
    label: "\u98A8\u901F",
    value: sector.wind,
    unit: "\u7BC0",
    detail: sector.windDir,
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "wind"
    })
  }), /*#__PURE__*/React.createElement(TelemetryStat, {
    label: "\u6D6A\u9AD8",
    value: sector.waves,
    unit: "\u516C\u5C3A",
    tone: waveWarn ? 'warn' : 'cyan',
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "waves"
    })
  }), /*#__PURE__*/React.createElement(TelemetryStat, {
    label: "\u6F6E\u6C50",
    value: sector.tide,
    tone: "plain",
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "activity"
    })
  }), /*#__PURE__*/React.createElement(TelemetryStat, {
    label: "\u6D0B\u6D41",
    value: sector.current,
    unit: "\u7BC0",
    tone: "accent",
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "navigation"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(RiskMeter, {
    value: sector.danger,
    label: "\u7FFB\u8986\u98A8\u96AA\u6307\u6578"
  }))), /*#__PURE__*/React.createElement(Card, {
    eyebrow: "\u5340\u6BB5\u76E3\u8996",
    title: "\u6D77\u5CB8\u7DB2\u683C",
    padding: "var(--pad-card)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: mobile ? 10 : 8
    }
  }, sectors.map(s => {
    const isSel = s.id === selectedId;
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => onSelect(s.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        minHeight: mobile ? 52 : 44,
        padding: mobile ? '12px 14px' : '9px 12px',
        cursor: 'pointer',
        textAlign: 'left',
        background: isSel ? 'var(--accent-soft)' : 'transparent',
        border: `1px solid ${isSel ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: s.color,
        boxShadow: `0 0 8px ${s.color}`,
        flexShrink: 0,
        animation: s.danger >= 7.5 ? 'a3-breathe 1.8s var(--ease-out) infinite' : 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        color: isSel ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: mobile ? 14 : 'var(--text-sm)',
        fontWeight: isSel ? 600 : 400,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, s.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: mobile ? 16 : 'var(--text-sm)',
        fontWeight: 700,
        color: s.color,
        fontVariantNumeric: 'tabular-nums'
      }
    }, s.danger.toFixed(1)));
  }))));
}
window.TelemetryRail = TelemetryRail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/TelemetryRail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/sw.js
try { (() => {
/* ============================================================
   A3 Maritime Intelligence — Service Worker
   Strategy: stale-while-revalidate for local assets,
             cache-first-with-network-fallback for CDN.
   ============================================================ */

const CACHE_NAME = 'a3-maritime-v3';
const LOCAL_ASSETS = ['./index.html', './manifest.json', './icon-192.svg', './icon-512.svg', './Header.jsx', './GeospatialCanvas.jsx', './TelemetryRail.jsx', './RagFeed.jsx', '../../styles.css', '../../_ds_bundle.js', '../../tokens/base.css', '../../tokens/colors.css', '../../tokens/effects.css', '../../tokens/fonts.css', '../../tokens/spacing.css', '../../tokens/typography.css'];

/* ---------- Install: precache local assets ---------- */
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    console.log('[A3 SW] Precaching local assets…');
    return Promise.allSettled(LOCAL_ASSETS.map(url => cache.add(url).catch(e => console.warn('[A3 SW] Skip:', url, e.message))));
  }).then(() => self.skipWaiting()));
});

/* ---------- Activate: clear old caches ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
    console.log('[A3 SW] Removing old cache:', k);
    return caches.delete(k);
  }))).then(() => self.clients.claim()));
});

/* ---------- Fetch: stale-while-revalidate ---------- */
self.addEventListener('fetch', event => {
  const {
    request
  } = event;
  const url = new URL(request.url);

  /* Skip non-GET, devtools, chrome-extension */
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname === 'localhost' && url.pathname.startsWith('/__')) return;
  event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(request).then(cached => {
    /* Always fire a network fetch to keep cache fresh */
    const networkFetch = fetch(request).then(response => {
      /* Cache valid responses (including opaque CDN) */
      if (response.status === 200 || response.type === 'opaque') {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => {
      /* Network failed — fall back to cache or offline stub */
      if (cached) return cached;
      if (request.headers.get('accept')?.includes('text/html')) {
        return cache.match('./index.html');
      }
      return new Response(JSON.stringify({
        error: 'offline',
        message: '目前離線，請稍後再試'
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    /* Return stale cache immediately; update in background */
    return cached ?? networkFetch;
  })));
});

/* ---------- Push notifications (placeholder) ---------- */
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title || 'A3 海象警報', {
    body: data.body || '',
    icon: './icon-192.svg',
    badge: './icon-192.svg',
    tag: data.tag || 'a3-alert',
    data: {
      url: data.url || './index.html'
    }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || './index.html'));
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/sw.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.RuleMatch = __ds_scope.RuleMatch;

__ds_ns.RiskMeter = __ds_scope.RiskMeter;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.TelemetryStat = __ds_scope.TelemetryStat;

})();
