import { useState } from "react";
import { Globe, Database, ShieldCheck, Zap, Home as HomeIcon, ArrowRight, BarChart2, RefreshCw, Package, Activity } from "lucide-react";
import FalabellaView from "./components/FalabellaView";
import LenovoView from "./components/lenovo";
import TecnoclifeView from "./components/tecnolife";
import Ebay from "./components/ebay";

function Home() {
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState("Inicio");
  const logoPath = "/logo_scrapeflow.png";

  const tiendas = [
    { key: "Falabella",  label: "Falabella",  subtitle: "Comparativa de portátiles", icon: <Database size={20} />,    color: "#00e5a0", bg: "rgba(0,229,160,0.1)",   num: "01" },
    { key: "Lenovo",     label: "Lenovo",     subtitle: "ThinkPads oficiales",        icon: <ShieldCheck size={20} />, color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  num: "02" },
    { key: "Ebay",       label: "Ebay",       subtitle: "Hardware internacional",    icon: <Globe size={20} />,        color: "#a78bfa", bg: "rgba(167,139,250,0.1)", num: "03" },
    { key: "Tecnoclife", label: "Tecnoclife", subtitle: "Stock nacional",            icon: <Zap size={20} />,          color: "#00e5a0", bg: "rgba(0,229,160,0.1)",   num: "04" },
  ];

  const features = [
    { icon: <RefreshCw size={22} />, label: "Tiempo real",     desc: "Feeds en vivo desde cada distribuidor activo.",  tag: "LIVE" },
    { icon: <BarChart2 size={22} />, label: "Análisis cruzado",      desc: "Compara specs y precios entre todas las fuentes.",  tag: "AI" },
    { icon: <Package size={22} />,   label: "Control de stock",      desc: "Alertas de disponibilidad e inventario en tiempo.", tag: "AUTO" },
    { icon: <Database size={22} />,  label: "Exportación directa",   desc: "Reportes estructurados listos para auditoría.",    tag: "PRO" },
  ];

  const renderLanding = () => (
    <main>
      <style>{`
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

        /* ══ HERO ══════════════════════════════════════════════ */
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

        /* ── LEFT ── */
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
          /* Imagen estática: sin animación ni saltos */
          transform: translateY(0px);
        }
        .sf-robot-shadow {
          position: absolute; bottom: 80px; left: 50%;
          transform: translateX(-50%);
          width: 240px; height: 30px;
          background: radial-gradient(ellipse, rgba(0,229,160,0.2) 0%, transparent 70%);
          filter: blur(12px);
          opacity: 0.75;
        }

        .sf-brand {
          position: relative; z-index: 2;
        }
        .sf-wordmark {
          font-family: var(--sans);
          font-size: clamp(72px, 10vw, 128px);
          font-weight: 900;
          line-height: 0.75;
          letter-spacing: -0.05em;
          color: var(--text);
        }
        .sf-wordmark em {
          font-style: normal;
          color: var(--green);
          text-shadow: 0 0 40px rgba(0,229,160,0.5);
        }
        .sf-brand-meta {
          margin-top: 28px;
          display: flex; align-items: center; gap: 20px;
        }
        .sf-brand-tag {
          font-family: var(--mono);
          font-size: 11px; color: var(--green);
          letter-spacing: 0.15em;
          opacity: 0.85;
        }
        .sf-brand-line {
          flex: 1; max-width: 140px; height: 1px;
          background: linear-gradient(90deg, rgba(0,229,160,0.4), transparent);
        }
        .sf-brand-version {
          font-family: var(--mono);
          font-size: 11px; color: var(--muted);
          letter-spacing: 0.1em;
        }

        /* ── RIGHT ── */
        .sf-right {
          position: relative; z-index: 1;
          background: var(--bg2);
          border-left: 1px solid var(--border);
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 56px 64px;
        }

        .sf-panel-header {
          margin-bottom: 32px;
        }
        .sf-panel-kicker {
          font-family: var(--mono);
          font-size: 11px; color: var(--green);
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 10px; opacity: 0.8;
        }
        .sf-panel-title {
          font-family: var(--sans);
          font-size: 24px; font-weight: 700;
          color: var(--text); letter-spacing: -0.02em;
        }

        /* store rows */
        .sf-store-list { display: flex; flex-direction: column; gap: 14px; }
        .sf-store-btn {
          display: flex; align-items: center; gap: 0;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer; transition: all 0.2s ease;
          width: 100%; text-align: left;
          overflow: hidden; position: relative;
        }
        .sf-store-btn:hover {
          border-color: rgba(0,229,160,0.4);
          background: rgba(0,229,160,0.04);
          box-shadow: 0 0 0 1px rgba(0,229,160,0.12) inset;
          transform: translateY(-1px);
        }
        .sf-store-num {
          font-family: var(--mono);
          font-size: 13px; color: var(--muted);
          width: 56px; min-width: 56px;
          height: 68px;
          display: flex; align-items: center; justify-content: center;
          border-right: 1px solid var(--border);
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .sf-store-btn:hover .sf-store-num { color: var(--green); }
        .sf-store-body {
          flex: 1; padding: 16px 20px;
          display: flex; align-items: center; gap: 20px;
        }
        .sf-store-icon {
          width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .sf-store-name {
          font-family: var(--sans); font-size: 16px; font-weight: 700;
          color: var(--text); line-height: 1.3;
        }
        .sf-store-sub {
          font-family: var(--sans); font-size: 13px;
          color: var(--muted); margin-top: 2px;
        }
        .sf-store-arrow {
          padding: 0 20px; color: var(--muted); flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }
        .sf-store-btn:hover .sf-store-arrow { color: var(--green); transform: translateX(4px); }

        .sf-status {
          margin-top: 36px;
          padding: 16px 20px;
          background: rgba(0,229,160,0.05);
          border: 1px solid rgba(0,229,160,0.15);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sf-status-left { display: flex; align-items: center; gap: 12px; }
        .sf-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 10px var(--green);
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .sf-status-text {
          font-family: var(--mono); font-size: 11px;
          color: var(--green); letter-spacing: 0.12em; opacity: 0.85;
        }
        .sf-status-count {
          font-family: var(--mono); font-size: 11px;
          color: var(--muted); letter-spacing: 0.1em;
        }

        /* ══ FEATURES ═══════════════════════════════════════════ */
        .sf-features {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          padding: 96px 80px;
        }
        .sf-features-inner { max-width: 1440px; margin: 0 auto; }

        .sf-feat-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 56px; padding-bottom: 48px;
          border-bottom: 1px solid var(--border);
        }
        .sf-feat-kicker {
          font-family: var(--mono); font-size: 11px;
          color: var(--green); letter-spacing: 0.22em; opacity: 0.75;
          margin-bottom: 12px;
        }
        .sf-feat-h2 {
          font-family: var(--sans); font-size: clamp(32px, 3.5vw, 46px);
          font-weight: 800; color: var(--text);
          letter-spacing: -0.025em; line-height: 1.15; max-width: 580px;
        }
        .sf-feat-h2 em { font-style: normal; color: var(--green); }
        .sf-feat-right-meta {
          text-align: right; flex-shrink: 0;
        }
        .sf-feat-big-num {
          font-family: var(--mono); font-size: 96px; font-weight: 700;
          color: rgba(0,229,160,0.06); line-height: 0.95; letter-spacing: -0.04em;
        }
        .sf-feat-right-label {
          font-family: var(--mono); font-size: 11px; color: var(--muted);
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        .sf-feat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .sf-feat-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 36px 28px;
          position: relative; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 250px;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .sf-feat-card:hover {
          background: var(--bg3);
          border-color: rgba(0,229,160,0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        .sf-feat-card::before {
          content: attr(data-tag);
          position: absolute; top: 24px; right: 24px;
          font-family: var(--mono); font-size: 10px;
          color: var(--green); letter-spacing: 0.15em;
          opacity: 0.55;
        }
        .sf-feat-icon-wrap {
          width: 54px; height: 54px; border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(0,229,160,0.05); color: var(--green);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; transition: all 0.2s;
        }
        .sf-feat-card:hover .sf-feat-icon-wrap {
          background: rgba(0,229,160,0.12);
          border-color: rgba(0,229,160,0.4);
        }
        .sf-feat-name {
          font-family: var(--sans); font-size: 18px; font-weight: 700;
          color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .sf-feat-desc {
          font-family: var(--sans); font-size: 13px;
          color: var(--muted); line-height: 1.7;
          max-width: 90%;
        }
        .sf-feat-card-num {
          position: absolute; bottom: 20px; right: 24px;
          font-family: var(--mono); font-size: 32px; font-weight: 700;
          color: rgba(255,255,255,0.04); line-height: 1;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="sf-hero">
        <div className="sf-grid-bg" />
        <div className="sf-vignette" />

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
              <span className="sf-brand-tag">// MARKET INTELLIGENCE</span>
              <div className="sf-brand-line" />
              <span className="sf-brand-version">v2.6.0</span>
            </div>
          </div>
        </div>

        <div className="sf-right">
          <div className="sf-panel-header">
            <div className="sf-panel-kicker">// SELECCIONA FUENTE</div>
            <div className="sf-panel-title">Elige una tienda para explorar</div>
          </div>

          <div className="sf-store-list">
            {tiendas.map((t) => (
              <button key={t.key} className="sf-store-btn" onClick={() => setTiendaSeleccionada(t.key)}>
                <span className="sf-store-num">{t.num}</span>
                <div className="sf-store-body">
                  <div className="sf-store-icon" style={{ background: t.bg, color: t.color }}>{t.icon}</div>
                  <div>
                    <div className="sf-store-name">{t.label}</div>
                    <div className="sf-store-sub">{t.subtitle}</div>
                  </div>
                </div>
                <ArrowRight size={16} className="sf-store-arrow" />
              </button>
            ))}
          </div>

          <div className="sf-status">
            <div className="sf-status-left">
              <span className="sf-status-dot" />
              <span className="sf-status-text">SISTEMA ACTIVO</span>
            </div>
            <span className="sf-status-count">4 FUENTES · TIEMPO REAL</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="sf-features">
        <div className="sf-features-inner">
          <div className="sf-feat-top">
            <div>
              <div className="sf-feat-kicker">// CAPACIDADES</div>
              <h2 className="sf-feat-h2">Monitoreo <em>inteligente</em><br/>del mercado tech</h2>
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
                <span className="sf-feat-card-num">0{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  const renderVista = () => {
    switch (tiendaSeleccionada) {
      case "Falabella":  return <FalabellaView />;
      case "Lenovo":     return <LenovoView />;
      case "Ebay":       return <Ebay />;
      case "Tecnoclife": return <TecnoclifeView />;
      default:           return renderLanding();
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04080f; }
        button { border: none; background: none; cursor: pointer; }

        :root {
          --bg:      #04080f;
          --bg2:     #080e1a;
          --border:  rgba(255,255,255,0.07);
          --green:   #00e5a0;
          --text:    #e8eaf0;
          --muted:   rgba(232,234,240,0.5);
          --mono:    'Space Mono', monospace;
          --sans:    'Outfit', sans-serif;
        }

        /* ── HEADER ── */
        .sf-header {
          position: sticky; top: 0; z-index: 50; height: 80px;
          background: rgba(4,8,15,0.95);
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
        .sf-logo-word em {
          font-style: normal; color: var(--green);
          text-shadow: 0 0 20px rgba(0,229,160,0.4);
        }
        .sf-logo-sub {
          font-family: var(--mono);
          font-size: 9px; color: rgba(232,234,240,0.35);
          letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px;
        }

        /* Nuevo Nav compacto */
        .sf-nav {
          display: flex; align-items: center; gap: 12px;
        }
        .sf-nav-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 8px;
          font-family: var(--sans); font-size: 13px; font-weight: 600;
          letter-spacing: 0.02em; transition: all 0.18s;
          color: rgba(232,234,240,0.5);
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.01);
        }
        .sf-nav-btn.active {
          background: rgba(0,229,160,0.12);
          color: var(--green);
          border-color: var(--green);
          box-shadow: 0 0 12px rgba(0,229,160,0.2);
        }
        .sf-nav-btn:hover {
          color: rgba(232,234,240,0.9);
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.15);
        }

        /* system bar */
        .sf-sys-bar {
          display: flex; align-items: center; gap: 24px;
        }
        .sf-sys-item {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--mono);
          font-size: 10px; color: rgba(232,234,240,0.4);
          letter-spacing: 0.12em;
        }
        .sf-sys-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green); box-shadow: 0 0 6px var(--green);
          animation: sysPulse 3s ease-in-out infinite;
        }
        @keyframes sysPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* ── FOOTER ── */
        .sf-footer {
          background: var(--bg); border-top: 1px solid var(--border);
          padding: 28px 80px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sf-footer-left {
          font-family: var(--mono);
          font-size: 11px; color: rgba(232,234,240,0.2);
          letter-spacing: 0.08em;
        }
        .sf-footer-left em { font-style: normal; color: rgba(0,229,160,0.5); }
        .sf-footer-right {
          font-family: var(--mono);
          font-size: 10px; color: rgba(232,234,240,0.12);
          letter-spacing: 0.12em; text-transform: uppercase;
        }
      `}</style>

      {/* HEADER */}
      <header className="sf-header">
        <div className="sf-header-inner">
          <div className="sf-logo" onClick={() => setTiendaSeleccionada("Inicio")}>
            <div className="sf-logo-img">
              <img src={logoPath} alt="ScrapeFlow"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
            <div>
              <div className="sf-logo-word">Scrape<em>Flow</em></div>
              <div className="sf-logo-sub">Market Intelligence v2.6</div>
            </div>
          </div>

          <nav className="sf-nav">
            <button className={`sf-nav-btn ${tiendaSeleccionada === "Inicio" ? "active" : ""}`} onClick={() => setTiendaSeleccionada("Inicio")}>
              <HomeIcon size={14} /> Dashboard
            </button>
            <button className={`sf-nav-btn ${tiendaSeleccionada === "Scrapers" ? "active" : ""}`} onClick={() => setTiendaSeleccionada("Inicio")}>
              Scrapers
            </button>
          </nav>

          <div className="sf-sys-bar">
            <div className="sf-sys-item"><span className="sf-sys-dot" /> ONLINE</div>
            <div className="sf-sys-item"><Activity size={12} /> 4 FEEDS</div>
          </div>
        </div>
      </header>

      {renderVista()}

      <footer className="sf-footer">
        <div className="sf-footer-left">© 2026 <em>ScrapeFlow</em> — Herramienta de Auditoría de Hardware</div>
        <div className="sf-footer-right">BUILD 2026.05 · ALL SYSTEMS OPERATIONAL</div>
      </footer>
    </div>
  );
}

export default Home;