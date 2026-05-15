import { useState } from "react";
import { Globe, Database, ShieldCheck, Zap, Home as HomeIcon, ArrowRight, BarChart2, RefreshCw, Package, Activity, Info, ExternalLink, Scale } from "lucide-react";
import FalabellaView from "./components/FalabellaView";
import LenovoView from "./components/lenovo";
import TecnoclifeView from "./components/tecnolife";
import Ebay from "./components/ebay";
import InformacionView from "./components/informationView";
import ComparativaView from "./components/comparativaView";
import ChatBot from "./components/chatbot";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  :root {
    --bg:      #04080f;
    --bg2:     #080e1a;
    --bg3:     #0c1320;
    --border:  rgba(255,255,255,0.07);
    --green:   #00e5a0;
    --blue:    #38bdf8;
    --purple:  #a78bfa;
    --text:    #e8eaf0;
    --muted:   rgba(232,234,240,0.5);
    --mono:    'Space Mono', monospace;
    --sans:    'Outfit', sans-serif;
  }

  [class*="sf-"] { box-sizing: border-box; }
  body { background: var(--bg); }

  /* ── HEADER ─────────────────────────────────────────────── */
  .sf-header {
    position: sticky; top: 0; z-index: 50; height: 80px;
    background: rgba(4,8,15,0.97);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
  }
  .sf-header-inner {
    height: 100%; padding: 0 80px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* logo */
  .sf-logo {
    display: flex; align-items: center; gap: 16px; cursor: pointer;
  }
  .sf-logo-img {
    width: 44px; height: 44px; border-radius: 10px; overflow: hidden;
    border: 1px solid rgba(0,229,160,0.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.25s;
  }
  .sf-logo:hover .sf-logo-img {
    border-color: rgba(0,229,160,0.5);
    box-shadow: 0 0 16px rgba(0,229,160,0.25);
  }
  .sf-logo-word {
    font-family: var(--sans);
    font-size: 19px; font-weight: 800; color: var(--text);
    letter-spacing: -0.02em; line-height: 1;
  }
  .sf-logo-word em { font-style: normal; color: var(--green); text-shadow: 0 0 20px rgba(0,229,160,0.4); }

  /* nav — pill container */
  .sf-nav {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 5px;
    gap: 4px;
  }
  .sf-nav-divider {
    width: 1px; height: 20px;
    background: var(--border);
    margin: 0 2px;
    flex-shrink: 0;
  }
  .sf-nav-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 8px;
    font-family: var(--sans); font-size: 12px; font-weight: 600;
    letter-spacing: 0.03em; transition: all 0.18s;
    color: rgba(232,234,240,0.4);
    background: transparent;
    border: none; cursor: pointer;
    white-space: nowrap;
  }
  .sf-nav-btn.active {
    background: rgba(0,229,160,0.12);
    color: var(--green);
    box-shadow: 0 0 12px rgba(0,229,160,0.12);
  }
  .sf-nav-btn:hover:not(.active) {
    color: rgba(232,234,240,0.8);
    background: rgba(255,255,255,0.04);
  }
  .sf-nav-btn-info {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 8px;
    font-family: var(--sans); font-size: 12px; font-weight: 600;
    letter-spacing: 0.03em; transition: all 0.18s;
    color: rgba(56,189,248,0.6);
    background: transparent;
    border: none; cursor: pointer;
    white-space: nowrap;
  }
  .sf-nav-btn-info:hover {
    color: var(--blue);
    background: rgba(56,189,248,0.06);
  }

  /* sys bar */
  .sf-sys-bar { display: flex; align-items: center; gap: 20px; }
  .sf-sys-item {
    display: flex; align-items: center; gap: 7px;
    font-family: var(--mono); font-size: 10px;
    color: rgba(232,234,240,0.35); letter-spacing: 0.12em;
  }
  .sf-sys-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 6px var(--green);
    animation: sysPulse 3s ease-in-out infinite;
  }
  @keyframes sysPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  /* ── FOOTER ─────────────────────────────────────────────── */
  .sf-footer {
    background: var(--bg); border-top: 1px solid var(--border);
    padding: 28px 80px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sf-footer-left {
    font-family: var(--mono); font-size: 11px;
    color: rgba(232,234,240,0.18); letter-spacing: 0.08em;
  }
  .sf-footer-left em { font-style: normal; color: rgba(0,229,160,0.45); }
  .sf-footer-right {
    font-family: var(--mono); font-size: 10px;
    color: rgba(232,234,240,0.1); letter-spacing: 0.12em; text-transform: uppercase;
  }

  /* ── HERO ───────────────────────────────────────────────── */
  .sf-hero {
    min-height: calc(100vh - 80px);
    background: var(--bg);
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    position: relative;
    overflow: hidden;
  }
  .sf-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse 70% 80% at 30% 50%, black 0%, transparent 75%);
  }
  .sf-vignette {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 55% 70% at 28% 50%, rgba(0,229,160,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 80% 30%, rgba(56,189,248,0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  /* left panel */
  .sf-left {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 0 0 64px 80px;
    min-height: calc(100vh - 80px);
  }
  .sf-robot-stage {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 160px;
    display: flex; align-items: flex-end; justify-content: center;
  }
  .sf-robot-img {
    height: 55vh; max-height: 480px; width: auto;
    object-fit: contain; display: block;
    filter:
      drop-shadow(0 0 20px rgba(0,229,160,0.25))
      drop-shadow(0 0 40px rgba(0,100,220,0.1));
  }
  .sf-robot-shadow {
    position: absolute; bottom: 80px; left: 50%;
    transform: translateX(-50%);
    width: 240px; height: 30px;
    background: radial-gradient(ellipse, rgba(0,229,160,0.2) 0%, transparent 70%);
    filter: blur(12px); opacity: 0.75;
  }
  .sf-brand { position: relative; z-index: 2; }
  .sf-wordmark {
    font-family: var(--sans);
    font-size: clamp(72px, 10vw, 128px);
    font-weight: 900; line-height: 0.75;
    letter-spacing: -0.05em; color: var(--text);
  }
  .sf-wordmark em {
    font-style: normal; color: var(--green);
    text-shadow: 0 0 40px rgba(0,229,160,0.5);
  }
  .sf-brand-meta {
    margin-top: 28px;
    display: flex; align-items: center; gap: 20px;
  }
  .sf-brand-tag {
    font-family: var(--mono); font-size: 11px;
    color: var(--green); letter-spacing: 0.15em; opacity: 0.85;
  }
  .sf-brand-line {
    flex: 1; max-width: 140px; height: 1px;
    background: linear-gradient(90deg, rgba(0,229,160,0.4), transparent);
  }
  .sf-brand-version {
    font-family: var(--mono); font-size: 11px;
    color: var(--muted); letter-spacing: 0.1em;
  }

  /* ── RIGHT PANEL ─────────────────────────────────────────── */
  .sf-right {
    position: relative; z-index: 1;
    background: var(--bg2);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 56px 56px;
  }
  .sf-right::before {
    content: '';
    position: absolute; top: 0; left: -1px; bottom: 0; width: 2px;
    background: linear-gradient(180deg, transparent 0%, rgba(0,229,160,0.35) 40%, rgba(56,189,248,0.25) 70%, transparent 100%);
  }

  .sf-panel-header { margin-bottom: 36px; }
  .sf-panel-kicker {
    font-family: var(--mono); font-size: 10px; color: var(--green);
    letter-spacing: 0.24em; text-transform: uppercase; margin-bottom: 8px; opacity: 0.7;
  }
  .sf-panel-title {
    font-family: var(--sans); font-size: 22px; font-weight: 700;
    color: var(--text); letter-spacing: -0.02em; line-height: 1.2;
  }

  /* ── STORE GRID (2×2) ───────────────────────────────────── */
  .sf-store-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .sf-store-card {
    display: flex; flex-direction: column;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
    text-align: left;
    position: relative;
    overflow: hidden;
    gap: 14px;
  }
  .sf-store-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--card-color, rgba(0,229,160,0.06)) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.22s;
  }
  .sf-store-card:hover {
    border-color: var(--card-color, rgba(0,229,160,0.35));
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--card-color, rgba(0,229,160,0.1)) inset;
    background: rgba(255,255,255,0.03);
  }
  .sf-store-card:hover::after { opacity: 1; }

  .sf-store-card-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .sf-store-card-icon {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.22s;
  }
  .sf-store-card:hover .sf-store-card-icon { transform: scale(1.08); }
  .sf-store-card-num {
    font-family: var(--mono);
    font-size: 13px; /* 🔥 más grande */
    color: rgba(255,255,255,0.55); /* 🔥 más visible */
    letter-spacing: 0.05em;
  }
  .sf-store-card-body { position: relative; z-index: 1; }
  .sf-store-card-name {
    font-family: var(--sans);
  font-size: 18px; /* 🔥 más grande */
  font-weight: 800; /* 🔥 más marcado */
  color: #ffffff; /* 🔥 blanco real */
  line-height: 1.3;
  margin-bottom: 6px;
  }
  .sf-store-card-sub {
    font-family: var(--sans);
  font-size: 13px; /* 🔥 más grande */
  color: rgba(255,255,255,0.75); /* 🔥 mucho más visible */
  line-height: 1.5;
  }
  .sf-store-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.04);
    padding-top: 12px;
    margin-top: 2px;
  }
  .sf-store-card-action {
    font-family: var(--mono);
  font-size: 12px; /* 🔥 más grande */
  color: rgba(255,255,255,0.7); /* 🔥 visible */
  letter-spacing: 0.08em;
  text-transform: uppercase;
  }
  .sf-store-card:hover .sf-store-card-action { color: var(--card-color, rgba(0,229,160,0.7)); }
  .sf-store-card-arrow {
    color: rgba(255,255,255,0.15);
    transition: color 0.18s, transform 0.18s;
    flex-shrink: 0;
  }
  .sf-store-card:hover .sf-store-card-arrow {
    color: var(--card-color, rgba(0,229,160,0.8));
    transform: translate(3px, -3px);
  }

  /* status bar */
  .sf-status {
    margin-top: 20px; padding: 13px 18px;
    background: rgba(0,229,160,0.04);
    border: 1px solid rgba(0,229,160,0.12);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sf-status-left { display: flex; align-items: center; gap: 10px; }
  .sf-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 8px var(--green);
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .sf-status-text { font-family: var(--mono); font-size: 10px; color: var(--green); letter-spacing: 0.14em; opacity: 0.8; }
  .sf-status-count { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; }

  /* ── FEATURES ───────────────────────────────────────────── */
  .sf-features { background: var(--bg2); border-top: 1px solid var(--border); padding: 96px 80px; }
  .sf-features-inner { max-width: 1440px; margin: 0 auto; }
  .sf-feat-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 56px; padding-bottom: 48px; border-bottom: 1px solid var(--border);
  }
  .sf-feat-kicker { font-family: var(--mono); font-size: 11px; color: var(--green); letter-spacing: 0.22em; opacity: 0.75; margin-bottom: 12px; }
  .sf-feat-h2 { font-family: var(--sans); font-size: clamp(32px, 3.5vw, 46px); font-weight: 800; color: var(--text); letter-spacing: -0.025em; line-height: 1.15; max-width: 580px; }
  .sf-feat-h2 em { font-style: normal; color: var(--green); }
  .sf-feat-right-meta { text-align: right; flex-shrink: 0; }
  .sf-feat-big-num { font-family: var(--mono); font-size: 96px; font-weight: 700; color: rgba(0,229,160,0.06); line-height: 0.95; letter-spacing: -0.04em; }
  .sf-feat-right-label { font-family: var(--mono); font-size: 15px; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; }
  .sf-feat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .sf-feat-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 14px;
    padding: 36px 28px; position: relative;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    min-height: 250px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .sf-feat-card:hover { background: var(--bg3); border-color: rgba(0,229,160,0.3); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
  .sf-feat-card::before { content: attr(data-tag); position: absolute; top: 24px; right: 24px; font-family: var(--mono); font-size: 10px; color: var(--green); letter-spacing: 0.15em; opacity: 0.55; }
  .sf-feat-icon-wrap { width: 54px; height: 54px; border-radius: 12px; border: 1px solid var(--border); background: rgba(0,229,160,0.05); color: var(--green); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: all 0.2s; }
  .sf-feat-card:hover .sf-feat-icon-wrap { background: rgba(0,229,160,0.12); border-color: rgba(0,229,160,0.4); }
  .sf-feat-name { font-family: var(--sans); font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em; }
  .sf-feat-desc { font-family: var(--sans); font-size: 18px; color: var(--muted); line-height: 1.7; max-width: 90%; }
  .sf-feat-card-num { position: absolute; bottom: 20px; right: 24px; font-family: var(--mono); font-size: 32px; font-weight: 700; color: rgba(255,255,255,0.04); line-height: 1; }
`;

function Home() {
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState("Inicio");
  const logoPath = "/logo_scrapeflow.png";

  const tiendas = [
    { key: "Falabella", label: "Falabella", subtitle: "Comparativa de portátiles", icon: <Database size={18} />, color: "#00e5a0", bg: "rgba(0,229,160,0.1)", cssColor: "rgba(0,229,160,0.35)", num: "01" },
    { key: "Lenovo", label: "Lenovo", subtitle: "ThinkPads oficiales", icon: <ShieldCheck size={18} />, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", cssColor: "rgba(56,189,248,0.35)", num: "02" },
    { key: "Ebay", label: "Ebay", subtitle: "Hardware internacional", icon: <Globe size={18} />, color: "#a78bfa", bg: "rgba(167,139,250,0.1)", cssColor: "rgba(167,139,250,0.35)", num: "03" },
    { key: "Tecnoclife", label: "Tecnoclife", subtitle: "Stock nacional", icon: <Zap size={18} />, color: "#00e5a0", bg: "rgba(0,229,160,0.1)", cssColor: "rgba(0,229,160,0.35)", num: "04" },
  ];

  const features = [
    { icon: <RefreshCw size={22} />, label: "Tiempo real", desc: "Feeds en vivo desde cada distribuidor activo.", tag: "LIVE" },
    { icon: <BarChart2 size={22} />, label: "Análisis cruzado", desc: "Compara specs y precios entre todas las fuentes.", tag: "AI" },
    { icon: <Package size={22} />, label: "Control de stock", desc: "Alertas de disponibilidad e inventario en tiempo.", tag: "AUTO" },
    { icon: <Database size={22} />, label: "Exportación directa", desc: "Reportes estructurados listos para auditoría.", tag: "PRO" },
  ];

  const renderLanding = () => (
    <main>
      <section className="sf-hero">
        <div className="sf-grid-bg" />
        <div className="sf-vignette" />

        {/* LEFT */}
        <div className="sf-left">
          <div className="sf-robot-stage">
            <div className="sf-robot-shadow" />
            <img
              src={logoPath} alt="ScrapeFlow"
              className="sf-robot-img"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
          <div className="sf-brand">
            <div className="sf-wordmark">Scrape<em>Flow</em></div>
            <div className="sf-brand-meta">
              <span className="sf-brand-tag">// BIEN MAKIA</span>
              <div className="sf-brand-line" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sf-right">
          <div className="sf-panel-header">
            <div className="sf-panel-title">Selecciona una fuente<br />de datos</div>
          </div>

          <div className="sf-store-grid">
            {tiendas.map((t) => (
              <button
                key={t.key}
                className="sf-store-card"
                style={{ "--card-color": t.cssColor } as React.CSSProperties}
                onClick={() => setTiendaSeleccionada(t.key)}
              >
                <div className="sf-store-card-top">
                  <div className="sf-store-card-icon" style={{ background: t.bg, color: t.color }}>
                    {t.icon}
                  </div>
                  <span className="sf-store-card-num">{t.num}</span>
                </div>
                <div className="sf-store-card-body">
                  <div className="sf-store-card-name">{t.label}</div>
                  <div className="sf-store-card-sub">{t.subtitle}</div>
                </div>
                <div className="sf-store-card-footer">
                  <span className="sf-store-card-action">Explorar</span>
                  <ExternalLink size={20} className="sf-store-card-arrow" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sf-features">
        <div className="sf-features-inner">
          <div className="sf-feat-top">
            <div>
              <div className="sf-feat-kicker">// CAPACIDADES</div>
              <h2 className="sf-feat-h2">Monitoreo <em>inteligente</em><br />del mercado tech</h2>
            </div>
            <div className="sf-feat-right-meta">
              <div className="sf-feat-big-num">04</div>
              <div className="sf-feat-right-label">módulos activos</div>
            </div>
          </div>
          <div className="sf-feat-grid">
            {features.map((f, i) => (
              <div key={i} className="sf-feat-card" data-tag={f.tag}>
                <div>
                  <div className="sf-feat-icon-wrap">{f.icon}</div>
                  <div className="sf-feat-name">{f.label}</div>
                  <p className="sf-feat-desc">{f.desc}</p>
                </div>
                <span className="sf-feat-card-num">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  const renderVista = () => {
    switch (tiendaSeleccionada) {
      case "Falabella": return <FalabellaView />;
      case "Lenovo": return <LenovoView />;
      case "Ebay": return <Ebay />;
      case "Tec  **Highlight de Ahorro:** La tabla calcula automáticamente el `Math.min` de los precios del grupo y resalta en verde cuál es la tienda más barnoclife": return <TecnoclifeView />;
      case "Información": return <InformacionView />;
      case "Comparación": return <ComparativaView />;
      default: return renderLanding();
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{GLOBAL_STYLES}</style>

      <header className="sf-header">
        <div className="sf-header-inner">

          {/* LOGO */}
          <div className="sf-logo" onClick={() => setTiendaSeleccionada("Inicio")}>
            <div>
              <div className="sf-logo-word">Scrape<em>Flow</em></div>
            </div>
          </div>

          {/* NAV — solo Dashboard + separador + Información */}
          <nav className="sf-nav">
            <button
              className={`sf-nav-btn ${tiendaSeleccionada === "Inicio" ? "active" : ""}`}
              onClick={() => setTiendaSeleccionada("Inicio")}
            >
              <HomeIcon size={13} />
              Dashboard
            </button>

            {/* BOTÓN NUEVO */}
            <button
              className={`sf-nav-btn ${tiendaSeleccionada === "Comparación" ? "active" : ""}`}
              onClick={() => setTiendaSeleccionada("Comparación")}
            >
              <Scale size={13} />
              Comparativa
            </button>

            <div className="sf-nav-divider" />

            <button
              className={`sf-nav-btn-info ${tiendaSeleccionada === "Información" ? "active" : ""}`}
              onClick={() => setTiendaSeleccionada("Información")}
            >
              <Info size={13} />
              Información
            </button>
          </nav>

          {/* SYS BAR */}
          <div className="sf-sys-bar">
            <div className="sf-sys-item"><span className="sf-sys-dot" /> Datos en vivo</div>
          </div>

        </div>
      </header>

      {renderVista()}
      <ChatBot />

      <footer className="sf-footer">
        <div className="sf-footer-left">© 2026 <em>ScrapeFlow</em> — Herramienta de Auditoría de Hardware</div>
        <div className="sf-footer-right">BUILD 2026.05 · ALL SYSTEMS OPERATIONAL</div>
      </footer>
    </div>
  );
}

export default Home;