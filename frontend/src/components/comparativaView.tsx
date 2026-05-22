import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  ExternalLink, Filter, TrendingDown, TrendingUp, Zap,
  BarChart2, PieChart, Activity, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart as RPieChart,
  Pie, Cell, AreaChart, Area
} from "recharts";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  tienda: string;
  url: string;
  imagen: string;
  moneda?: string;
}

interface ProductoNorm extends Producto {
  precioNorm: number;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const TASA_CAMBIO = 4000;
const ITEMS_POR_PAGINA = 6;

const COLORES_TIENDAS: Record<string, string> = {
  eBay: "#3b82f6",
  Alkosto: "#22c55e",
  Falabella: "#f59e0b",
  MercadoLibre: "#f97316",
  Amazon: "#a855f7",
};

const COLOR_FALLBACK = ["#6366f1", "#ec4899", "#14b8a6", "#f43f5e"];

function colorTienda(tienda: string, idx: number) {
  return COLORES_TIENDAS[tienda] ?? COLOR_FALLBACK[idx % COLOR_FALLBACK.length];
}

// ─── Formateadores ────────────────────────────────────────────────────────────

const fmtCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(n);

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

// ─── Tooltip personalizado ────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <p className="tooltip-label">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color ?? entry.fill }}>
          <span>{entry.name}: </span>
          <strong>{fmtCOP(entry.value)}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

const ComparativaView: React.FC = () => {
  const [productos, setProductos] = useState<ProductoNorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState("TODAS");
  const [pagina, setPagina] = useState(1);
  const tablaRef = useRef<HTMLDivElement>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/productos`)
      .then((r) => r.json())
      .then((data: Producto[]) => {
        setProductos(
          data.map((p) => ({
            ...p,
            precioNorm:
              p.tienda.toLowerCase() === "ebay"
                ? p.precio * TASA_CAMBIO
                : p.precio,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching:", err);
        setLoading(false);
      });
  }, []);

  // ── Datos derivados ────────────────────────────────────────────────────────

  const tiendas = useMemo(
    () => Array.from(new Set(productos.map((p) => p.tienda))),
    [productos]
  );

  const productosFiltrados = useMemo(
    () =>
      tiendaSeleccionada === "TODAS"
        ? productos
        : productos.filter((p) => p.tienda === tiendaSeleccionada),
    [productos, tiendaSeleccionada]
  );

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA));

  const productosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
    return productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [productosFiltrados, pagina]);

  const stats = useMemo(() => {
    if (!productosFiltrados.length) return { min: 0, max: 0, avg: 0 };
    const p = productosFiltrados.map((x) => x.precioNorm);
    return {
      min: Math.min(...p),
      max: Math.max(...p),
      avg: Math.round(p.reduce((a, b) => a + b, 0) / p.length),
    };
  }, [productosFiltrados]);

  const mejorGlobal = useMemo(
    () => [...productos].sort((a, b) => a.precioNorm - b.precioNorm)[0],
    [productos]
  );

  // ── Datos para gráficas ────────────────────────────────────────────────────

  // 1. Precio promedio por tienda (barras agrupadas)
  const dataBars = useMemo(
    () =>
      tiendas.map((t, i) => {
        const ps = productos
          .filter((p) => p.tienda === t)
          .map((p) => p.precioNorm);
        return {
          tienda: t,
          promedio: Math.round(ps.reduce((a, b) => a + b, 0) / (ps.length || 1)),
          minimo: Math.min(...ps),
          maximo: Math.max(...ps),
          color: colorTienda(t, i),
        };
      }),
    [productos, tiendas]
  );

  // 2. Distribución por tienda (pie)
  const dataPie = useMemo(
    () =>
      tiendas.map((t, i) => ({
        name: t,
        value: productos.filter((p) => p.tienda === t).length,
        color: colorTienda(t, i),
      })),
    [productos, tiendas]
  );

  // 3. Evolución de precios simulada (line chart — sustituible con datos reales)
  const dataLine = useMemo(() => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"];
    return meses.map((mes, idx) => {
      const entry: Record<string, any> = { mes };
      tiendas.forEach((t, ti) => {
        const base =
          productos
            .filter((p) => p.tienda === t)
            .reduce((a, b) => a + b.precioNorm, 0) /
          (productos.filter((p) => p.tienda === t).length || 1);
        const factor = 0.8 + 0.4 * Math.sin(idx * 0.8 + ti);
        entry[t] = Math.round(base * factor);
      });
      return entry;
    });
  }, [productos, tiendas]);

  // 4. Dispersión de precios (área apilada por rangos)
  const dataArea = useMemo(() => {
    const rangos = [
      { label: "< 500K", min: 0, max: 500_000 },
      { label: "500K–1M", min: 500_000, max: 1_000_000 },
      { label: "1M–3M", min: 1_000_000, max: 3_000_000 },
      { label: "3M–6M", min: 3_000_000, max: 6_000_000 },
      { label: "> 6M", min: 6_000_000, max: Infinity },
    ];
    return rangos.map((r) => {
      const entry: Record<string, any> = { label: r.label };
      tiendas.forEach((t) => {
        entry[t] = productos.filter(
          (p) => p.tienda === t && p.precioNorm >= r.min && p.precioNorm < r.max
        ).length;
      });
      return entry;
    });
  }, [productos, tiendas]);

  // ── Helpers de UI ──────────────────────────────────────────────────────────

  const irPagina = (n: number) => {
    const p = Math.max(1, Math.min(n, totalPaginas));
    setPagina(p);
    tablaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cambiarFiltro = (val: string) => {
    setTiendaSeleccionada(val);
    setPagina(1);
  };

  const paginasVisibles = () => {
    const arr: number[] = [];
    const start = Math.max(1, pagina - 2);
    const end = Math.min(totalPaginas, start + 4);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <div className="loading-ring" />
          <p>Cargando datos del mercado…</p>
        </div>
      </div>
    );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── CSS inline ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --surface2: #18181f;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --text: #e8e8f0;
          --muted: #6b6b80;
          --accent: #6366f1;
          --accent2: #22d3ee;
          --green: #22c55e;
          --red: #f43f5e;
          --amber: #f59e0b;
          --radius: 14px;
          --radius-sm: 8px;
          --font: 'DM Sans', 'Segoe UI', sans-serif;
          --mono: 'JetBrains Mono', 'Fira Code', monospace;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font); }

        .page { min-height: 100vh; background: var(--bg); padding: 24px; }

        /* ── Header ── */
        .page-header {
          max-width: 1400px; margin: 0 auto 28px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .page-header h1 {
          font-size: 22px; font-weight: 700; letter-spacing: -.5px;
          background: linear-gradient(135deg, #e8e8f0 0%, #6366f1 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .page-header .subtitle { font-size: 13px; color: var(--muted); margin-top: 2px; }

        /* ── Stats ── */
        .stats-grid {
          max-width: 1400px; margin: 0 auto 20px;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 14px;
        }
        .stat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 18px 20px;
          transition: border-color .2s;
        }
        .stat-card:hover { border-color: var(--border2); }
        .stat-card.accent-card { border-color: rgba(99,102,241,.3); background: rgba(99,102,241,.06); }
        .stat-icon { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 11px;
          font-weight: 600; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px; }
        .stat-icon svg { flex-shrink: 0; }
        .stat-value { font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--text); line-height: 1; }
        .stat-card.accent-card .stat-value { font-size: 15px; }
        .stat-sub { font-size: 12px; color: var(--green); margin-top: 6px; font-weight: 500; }

        /* ── Charts grid ── */
        .charts-section { max-width: 1400px; margin: 0 auto 20px; }
        .charts-title {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: .1em; color: var(--muted); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .charts-title::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 14px;
        }
        .charts-grid .chart-wide { grid-column: 1 / -1; }

        .chart-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 20px;
        }
        .chart-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .chart-card-title {
          font-size: 13px; font-weight: 600; color: var(--text);
          display: flex; align-items: center; gap: 7px;
        }
        .chart-card-title svg { color: var(--accent); }
        .chart-card-badge {
          font-size: 10px; padding: 3px 8px; border-radius: 20px;
          background: rgba(99,102,241,.15); color: var(--accent); font-weight: 600;
        }

        /* ── Recharts overrides ── */
        .recharts-text { font-family: var(--font) !important; font-size: 11px !important; fill: var(--muted) !important; }
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line { stroke: var(--border) !important; }
        .recharts-tooltip-wrapper { outline: none !important; }
        .custom-tooltip {
          background: var(--surface2); border: 1px solid var(--border2);
          border-radius: 10px; padding: 10px 14px; font-size: 12px;
          color: var(--text); backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,.4);
        }
        .custom-tooltip .tooltip-label {
          font-weight: 700; font-size: 12px; color: var(--muted);
          text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px;
        }
        .custom-tooltip p { margin: 3px 0; }
        .recharts-legend-item-text { color: var(--muted) !important; font-size: 11px !important; }

        /* ── Controles ── */
        .controls-bar {
          max-width: 1400px; margin: 0 auto 14px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px;
        }
        .filter-select-wrap {
          display: flex; align-items: center; gap: 8px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 8px 12px;
          transition: border-color .2s;
        }
        .filter-select-wrap:focus-within { border-color: var(--accent); }
        .filter-select-wrap select {
          background: transparent; color: var(--text); border: none; outline: none;
          font-size: 13px; font-weight: 500; font-family: var(--font); cursor: pointer;
        }
        .filter-select-wrap select option { background: #1a1a24; }
        .results-count { font-size: 12px; color: var(--muted); }

        /* ── Tabla ── */
        .table-wrap {
          max-width: 1400px; margin: 0 auto;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); overflow: hidden;
        }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        thead { background: var(--surface2); border-bottom: 1px solid var(--border2); }
        th {
          padding: 12px 16px; text-align: left;
          font-size: 10px; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: .12em; white-space: nowrap;
        }
        td {
          padding: 13px 16px; border-bottom: 1px solid var(--border);
          font-size: 13px; vertical-align: middle;
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr { transition: background .15s; }
        tbody tr:hover { background: rgba(255,255,255,.025); }
        tbody tr.best-row { background: rgba(99,102,241,.06); }
        tbody tr.best-row:hover { background: rgba(99,102,241,.1); }

        .prod-name {
          font-weight: 600; color: var(--text); max-width: 260px;
          line-height: 1.35; display: block;
        }
        .prod-img {
          width: 40px; height: 40px; border-radius: 8px;
          background: #fff; object-fit: contain; padding: 3px; flex-shrink: 0;
        }
        .prod-img-placeholder {
          width: 40px; height: 40px; border-radius: 8px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .flex-cell { display: flex; align-items: center; gap: 12px; }

        .badge {
          display: inline-flex; align-items: center;
          font-size: 10px; font-weight: 700; padding: 3px 9px;
          border-radius: 20px; text-transform: uppercase; letter-spacing: .06em;
          border: 1px solid; white-space: nowrap;
        }

        .price-original {
          font-family: var(--mono);
          font-size: 12px;
          color: rgba(232,232,240,0.92); /* más claro para mejor legibilidad */
          font-weight: 600;
          opacity: 0.95;
        }
        .price-cop {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-shadow: 0 1px 0 rgba(0,0,0,0.2);
        }
        .price-cop.best { color: var(--green); }
        .best-pill {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .05em; color: var(--green); background: rgba(34,197,94,.12);
          padding: 2px 6px; border-radius: 4px; margin-top: 3px;
        }

        .link-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--surface2); border: 1px solid var(--border);
          color: var(--muted); text-decoration: none; transition: all .15s;
        }
        .link-btn:hover { background: var(--green); border-color: var(--green); color: #fff; }

        /* ── Paginación ── */
        .pagination {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-top: 1px solid var(--border);
          flex-wrap: wrap; gap: 10px;
        }
        .pag-info { font-size: 12px; color: var(--muted); }
        .pag-buttons { display: flex; gap: 4px; align-items: center; }
        .pag-btn {
          padding: 6px 11px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--surface2);
          color: var(--text); font-size: 12px; font-family: var(--font);
          cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 4px;
        }
        .pag-btn:hover:not(:disabled) { border-color: var(--border2); background: rgba(255,255,255,.06); }
        .pag-btn:disabled { opacity: .3; cursor: default; }
        .pag-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 700; }
        .pag-sep { color: var(--muted); padding: 0 4px; font-size: 12px; }

        /* ── Loading ── */
        .loading-screen {
          min-height: 100vh; background: var(--bg);
          display: flex; align-items: center; justify-content: center;
        }
        .loading-inner { text-align: center; color: var(--muted); font-size: 14px; }
        .loading-ring {
          width: 40px; height: 40px; border-radius: 50%;
          border: 2px solid var(--border2); border-top-color: var(--accent);
          animation: spin .8s linear infinite; margin: 0 auto 14px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr; }
          .charts-grid .chart-wide { grid-column: 1; }
          .page { padding: 12px; }
        }
      `}</style>

      <div className="page">
        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <h1>Comparativa de Precios</h1>
            <p className="subtitle">{productos.length} productos · {tiendas.length} tiendas · Precios en COP</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><TrendingDown size={14} color="#22c55e" /> Precio mínimo</div>
            <div className="stat-value">{fmtCOP(stats.min)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><TrendingUp size={14} color="#f43f5e" /> Precio máximo</div>
            <div className="stat-value">{fmtCOP(stats.max)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><BarChart2 size={14} color="#6366f1" /> Promedio</div>
            <div className="stat-value">{fmtCOP(stats.avg)}</div>
          </div>
          {mejorGlobal && (
            <div className="stat-card accent-card">
              <div className="stat-icon"><Zap size={14} color="#6366f1" /> Mejor oferta global</div>
              <div className="stat-value">{mejorGlobal.nombre.slice(0, 36)}{mejorGlobal.nombre.length > 36 ? "…" : ""}</div>
              <div className="stat-sub">{fmtCOP(mejorGlobal.precioNorm)} · {mejorGlobal.tienda}</div>
            </div>
          )}
        </div>

        {/* ── Gráficas ── */}
        <div className="charts-section">
          <div className="charts-title"><Activity size={13} />Análisis estadístico</div>

          <div className="charts-grid">

            {/* 1. Línea — evolución de precios */}
            <div className="chart-card chart-wide">
              <div className="chart-card-header">
                <div className="chart-card-title"><Activity size={14} />Evolución de precios por tienda</div>
                <span className="chart-card-badge">Últimos 8 meses</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dataLine} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#6b6b80" }} />
                  <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "#6b6b80" }} width={56} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  {tiendas.map((t, i) => (
                    <Line
                      key={t}
                      type="monotone"
                      dataKey={t}
                      stroke={colorTienda(t, i)}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: colorTienda(t, i) }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 2. Barras — promedio, mín, máx por tienda */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title"><BarChart2 size={14} />Promedio / mín / máx por tienda</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dataBars} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tienda" tick={{ fontSize: 11, fill: "#6b6b80" }} />
                  <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "#6b6b80" }} width={56} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Bar dataKey="minimo" name="Mínimo" radius={[4, 4, 0, 0]}>
                    {dataBars.map((entry, i) => (
                      <Cell key={i} fill={colorTienda(entry.tienda, i)} fillOpacity={0.5} />
                    ))}
                  </Bar>
                  <Bar dataKey="promedio" name="Promedio" radius={[4, 4, 0, 0]}>
                    {dataBars.map((entry, i) => (
                      <Cell key={i} fill={colorTienda(entry.tienda, i)} />
                    ))}
                  </Bar>
                  <Bar dataKey="maximo" name="Máximo" radius={[4, 4, 0, 0]}>
                    {dataBars.map((entry, i) => (
                      <Cell key={i} fill={colorTienda(entry.tienda, i)} fillOpacity={0.35} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 3. Área apilada — distribución de rangos de precio */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title"><Activity size={14} />Distribución por rango de precio</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dataArea} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    {tiendas.map((t, i) => (
                      <linearGradient key={t} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colorTienda(t, i)} stopOpacity={0.5} />
                        <stop offset="95%" stopColor={colorTienda(t, i)} stopOpacity={0.05} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b6b80" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b6b80" }} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  {tiendas.map((t, i) => (
                    <Area
                      key={t}
                      type="monotone"
                      dataKey={t}
                      stackId="1"
                      stroke={colorTienda(t, i)}
                      strokeWidth={1.5}
                      fill={`url(#grad-${i})`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 4. Pie — productos por tienda */}
            <div className="chart-card" style={{ display: "flex", flexDirection: "column" }}>
              <div className="chart-card-header">
                <div className="chart-card-title"><PieChart size={14} />Productos por tienda</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 20 }}>
                <ResponsiveContainer width="60%" height={200}>
                  <RPieChart>
                    <Pie
                      data={dataPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dataPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0];
                        return (
                          <div className="custom-tooltip">
                            <p style={{ color: d.payload.color, fontWeight: 700 }}>{d.name}</p>
                            <p>{d.value} productos</p>
                          </div>
                        );
                      }}
                    />
                  </RPieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {dataPie.map((entry) => {
                    const total = dataPie.reduce((a, b) => a + b.value, 0);
                    const pct = Math.round((entry.value / total) * 100);
                    return (
                      <div key={entry.name} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: "#e8e8f0", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
                            {entry.name}
                          </span>
                          <span style={{ fontSize: 11, color: "#6b6b80", fontFamily: "var(--mono)" }}>{pct}%</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,.07)" }}>
                          <div style={{ height: "100%", borderRadius: 4, background: entry.color, width: `${pct}%`, transition: "width .6s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Controles ── */}
        <div className="controls-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="filter-select-wrap">
              <Filter size={14} color="#6b6b80" />
              <select value={tiendaSeleccionada} onChange={(e) => cambiarFiltro(e.target.value)}>
                <option value="TODAS">Todas las tiendas</option>
                {tiendas.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <span className="results-count">{productosFiltrados.length} productos encontrados</span>
        </div>

        {/* ── Tabla ── */}
        <div className="table-wrap" ref={tablaRef}>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ textAlign: "center" }}>Tienda</th>
                  <th style={{ textAlign: "right" }}>Precio original</th>
                  <th style={{ textAlign: "right" }}>Precio COP</th>
                  <th style={{ textAlign: "center" }}>Enlace</th>
                </tr>
              </thead>
              <tbody>
                {productosPaginados.map((p) => {
                  const esEbay = p.tienda.toLowerCase() === "ebay";
                  const esMejor = mejorGlobal && p._id === mejorGlobal._id;
                  const badgeStyle: React.CSSProperties = {
                    borderColor: colorTienda(p.tienda, tiendas.indexOf(p.tienda)),
                    color: colorTienda(p.tienda, tiendas.indexOf(p.tienda)),
                  };
                  return (
                    <tr key={p._id} className={esMejor ? "best-row" : ""}>
                      <td>
                        <div className="flex-cell">
                          {p.imagen ? (
                            <img
                              className="prod-img"
                              src={`${import.meta.env.VITE_API_URL}/proxy-imagen?url=${encodeURIComponent(p.imagen)}`}
                              alt=""
                            />
                          ) : (
                            <div className="prod-img-placeholder">🖥️</div>
                          )}
                          <span className="prod-name">{p.nombre}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="badge" style={badgeStyle}>{p.tienda}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="price-original">{esEbay ? fmtUSD(p.precio) : fmtCOP(p.precio)}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={`price-cop ${esMejor ? "best" : ""}`}>
                          {fmtCOP(p.precioNorm)}
                          {esMejor && <span className="best-pill">Mejor precio</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <a href={p.url} target="_blank" rel="noreferrer" className="link-btn" aria-label="Ver producto">
                          <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Paginación ── */}
          <div className="pagination">
            <span className="pag-info">
              Mostrando {Math.min((pagina - 1) * ITEMS_POR_PAGINA + 1, productosFiltrados.length)}–
              {Math.min(pagina * ITEMS_POR_PAGINA, productosFiltrados.length)} de {productosFiltrados.length}
            </span>
            <div className="pag-buttons">
              <button className="pag-btn" onClick={() => irPagina(pagina - 1)} disabled={pagina <= 1}>
                <ChevronLeft size={13} /> Anterior
              </button>
              {paginasVisibles().map((n) => (
                <button key={n} className={`pag-btn ${n === pagina ? "active" : ""}`} onClick={() => irPagina(n)}>
                  {n}
                </button>
              ))}
              <button className="pag-btn" onClick={() => irPagina(pagina + 1)} disabled={pagina >= totalPaginas}>
                Siguiente <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparativaView;