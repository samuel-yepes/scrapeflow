import { 
  Cpu, 
  Server, 
  Shield
} from "lucide-react";

export default function InformacionView() {
  const apis = [
    { name: "Falabella Scraper", status: "ONLINE", method: "GET", type: "PRIMARY", latency: "120ms", color: "#00e5a0" },
    { name: "Lenovo API Engine", status: "ONLINE", method: "POST",  type: "SECURE", latency: "85ms", color: "#38bdf8" },
    { name: "Ebay Data Pump", status: "ONLINE", method: "GET",  type: "GLOBAL", latency: "340ms", color: "#a78bfa" },
    { name: "Tecnoclife Inbound", status: "ONLINE", method: "GET", type: "PRIMARY", latency: "145ms", color: "#00e5a0" }
  ];

  return (
    <main className="sf-info-main">
      <style>{`
        .sf-info-main {
          background: var(--bg);
          padding: 32px 16px;
          min-height: calc(100vh - 172px);
          color: var(--text);
        }

        @media (min-width: 768px) {
          .sf-info-main {
            padding: 48px 32px;
          }
        }

        @media (min-width: 1200px) {
          .sf-info-main {
            padding: 64px 80px;
          }
        }

        .sf-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1300px;
          margin: 0 auto;
        }

        @media (min-width: 992px) {
          .sf-info-grid {
            grid-template-columns: 1fr 320px;
            gap: 40px;
          }
        }

        /* Columna Izquierda: Arquitectura */
        .sf-info-left {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        @media (min-width: 768px) {
          .sf-info-left {
            gap: 56px;
          }
        }

        .sf-info-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sf-info-title {
          font-family: var(--sans);
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .sf-info-title {
            font-size: 36px;
          }
        }

        @media (min-width: 1200px) {
          .sf-info-title {
            font-size: 42px;
          }
        }

        .sf-info-title em {
          font-style: normal;
          color: var(--green);
          text-shadow: 0 0 30px rgba(0, 229, 160, 0.3);
        }

        .sf-info-desc {
          font-family: var(--sans);
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
          max-width: 680px;
        }

        /* Sección Pipeline */
        .sf-pipeline {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .sf-pipeline {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 992px) {
          .sf-pipeline {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        .sf-pipe-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
        }

        @media (min-width: 1200px) {
          .sf-pipe-card {
            padding: 32px;
            gap: 20px;
          }
        }

        .sf-pipe-card:hover {
          border-color: rgba(0,229,160,0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        .sf-pipe-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(0,229,160,0.04);
          color: var(--green);
          border: 1px solid rgba(0,229,160,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sf-pipe-title {
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }

        .sf-pipe-text {
          font-family: var(--sans);
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* Lista de Apis */
        .sf-apis-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sf-api-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.2s;
        }

        @media (min-width: 576px) {
          .sf-api-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 18px 24px;
          }
        }

        .sf-api-row:hover {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
        }

        .sf-api-left {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .sf-api-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .sf-api-name-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sf-api-name {
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 600;
          word-break: break-word;
        }

        .sf-api-right {
          display: flex;
          align-items: center;
          justify-content: flex-between;
          gap: 24px;
          width: 100%;
        }

        @media (min-width: 576px) {
          .sf-api-right {
            width: auto;
            justify-content: flex-end;
            gap: 28px;
          }
        }

        .sf-api-badge {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(255,255,255,0.03);
          color: var(--muted);
        }

        .sf-api-latency {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--muted);
          margin-left: auto;
        }

        @media (min-width: 576px) {
          .sf-api-latency {
            margin-left: 0;
          }
        }

        /* Columna Derecha: Sistema y Métricas */
        .sf-info-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 24px;
        }

        @media (min-width: 640px) and (max-width: 991px) {
          .sf-info-right {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (min-width: 992px) {
          .sf-info-right {
            gap: 24px;
            padding: 28px;
          }
        }

        .sf-metric-box {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 16px;
        }

        @media (min-width: 640px) and (max-width: 991px) {
          .sf-metric-box {
            border-bottom: none;
            padding-bottom: 0;
            background: rgba(255,255,255,0.01);
            border: 1px solid rgba(255,255,255,0.03);
            padding: 16px;
            border-radius: 12px;
          }
        }
        
        .sf-metric-box:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .sf-metric-title {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.15em;
          margin-bottom: 6px;
        }

        .sf-metric-val {
          font-family: var(--sans);
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        @media (min-width: 768px) {
          .sf-metric-val {
            font-size: 22px;
          }
        }
        
        .sf-metric-val em {
          font-style: normal;
          font-size: 12px;
          color: var(--green);
          font-family: var(--mono);
        }
      `}</style>

      <div className="sf-info-grid">
        
        {/* Columna Izquierda: Arquitectura y Endpoints */}
        <div className="sf-info-left">
          
          {/* Cabecera */}
          <div className="sf-info-header">
            <h1 className="sf-info-title">
              Ecosistema de <em>Monitoreo ThinkPad</em>
            </h1>
            <p className="sf-info-desc">
              ScrapeFlow se encarga de auditar en vivo el inventario de portátiles, utilizando 
              scraping de alto rendimiento, sincronización automática y pipelines optimizados 
              para bases de datos.
            </p>
          </div>

          {/* Pipeline */}
          <div>
            <div className="sf-pipeline">
              <div className="sf-pipe-card">
                <div className="sf-pipe-icon-wrap"><Cpu size={20} /></div>
                <div>
                  <div className="sf-pipe-title">Procesamiento de Datos</div>
                  <div className="sf-pipe-text">
                    Arquitectura robusta para manejar consultas e inventarios 
                    hacia servidores locales y remotos.
                  </div>
                </div>
              </div>

              <div className="sf-pipe-card">
                <div className="sf-pipe-icon-wrap" style={{ color: "#38bdf8", borderColor: "rgba(56,189,248,0.2)" }}><Shield size={20} /></div>
                <div>
                  <div className="sf-pipe-title">Seguridad en Redes</div>
                  <div className="sf-pipe-text">
                    Auditoría de red perimetral mediante endpoints aislados y 
                    enmascaramiento de agentes.
                  </div>
                </div>
              </div>

              <div className="sf-pipe-card">
                <div className="sf-pipe-icon-wrap" style={{ color: "#a78bfa", borderColor: "rgba(167,139,250,0.2)" }}><Server size={20} /></div>
                <div>
                  <div className="sf-pipe-title">Sincronización en Vivo</div>
                  <div className="sf-pipe-text">
                    Actualización de stock y precios con la menor latencia posible 
                    en la infraestructura.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoints List */}
          <div>
            <div className="sf-apis-list">
              {apis.map((api, i) => (
                <div key={i} className="sf-api-row">
                  <div className="sf-api-left">
                    <div className="sf-api-dot" style={{ "background": api.color, "boxShadow": `0 0 8px ${api.color}` }}></div>
                    <div className="sf-api-name-block">
                      <span className="sf-api-name" style={{ color: api.color }}>{api.name}</span>
                    </div>
                  </div>
                  <div className="sf-api-right">
                    <span className="sf-api-badge">{api.status}</span>
                    <span className="sf-api-latency">{api.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Métricas y Resumen del Servidor */}
        <div className="sf-info-right">
          <div className="sf-metric-box">
            <div className="sf-metric-title">ESTADO GENERAL DEL NODO</div>
            <div className="sf-metric-val" style={{ color: "#00e5a0" }}>
              OPERACIONAL
            </div>
          </div>

          <div className="sf-metric-box">
            <div className="sf-metric-title">TOTAL ENDPOINTS</div>
            <div className="sf-metric-val">04 <em>módulos</em></div>
          </div>

          <div className="sf-metric-box">
            <div className="sf-metric-title">LATENCIA PROMEDIO</div>
            <div className="sf-metric-val">148ms <em>rápido</em></div>
          </div>

          <div className="sf-metric-box">
            <div className="sf-metric-title">BUILD COMPILATION</div>
            <div className="sf-metric-val" style={{ fontSize: "14px", fontFamily: "var(--mono)" }}>2026.05</div>
          </div>
        </div>

      </div>
    </main>
  );
}