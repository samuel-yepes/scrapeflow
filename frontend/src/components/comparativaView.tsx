import React, { useEffect, useState, useMemo } from "react";
import { ExternalLink, Filter, TrendingDown, TrendingUp, Zap } from "lucide-react";

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  tienda: string;
  url: string;
  imagen: string;
  moneda?: string; // "USD" o "COP"
}

const TASA_CAMBIO = 4000; // Ejemplo: 1 USD = 4000 COP

const ComparativaView: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState<string>("TODAS");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/productos`)
      .then((res) => res.json())
      .then((data: Producto[]) => {

        const dataNormalizada = data.map(p => ({
          ...p,
          precioNormalizado:
            p.tienda.toLowerCase() === 'ebay'
              ? p.precio * TASA_CAMBIO
              : p.precio
        }));

        setProductos(dataNormalizada);
        setLoading(false);

      })
      .catch(err => console.error("Error fetching:", err));
  }, []);

  // Formateadores
  const fmtCOP = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
  const fmtUSD = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  // Lógica de Filtrado y Estadísticas
  const productosFiltrados = useMemo(() => {
    return tiendaSeleccionada === "TODAS"
      ? productos
      : productos.filter(p => p.tienda === tiendaSeleccionada);
  }, [productos, tiendaSeleccionada]);

  const stats = useMemo(() => {
    if (productosFiltrados.length === 0) return { min: 0, max: 0 };
    const precios = productosFiltrados.map(p => (p as any).precioNormalizado);
    return {
      min: Math.min(...precios),
      max: Math.max(...precios),
      tiendas: Array.from(new Set(productos.map(p => p.tienda)))
    };
  }, [productosFiltrados, productos]);

  const productoGlobalMasBarato = [...productos].sort((a, b) => (a as any).precioNormalizado - (b as any).precioNormalizado)[0];

  if (loading) return <div className="p-20 text-center font-mono text-[#00e5a0] animate-pulse">CARGANDO MATRIZ DE DATOS...</div>;

  return (
    <div className="min-h-screen bg-[#080808] text-slate-300 p-4 md:p-10 font-sans">

      {/* 1. SECCIÓN DE ESTADÍSTICAS RÁPIDAS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <TrendingDown size={18} className="text-[#00e5a0]" />
            <span className="text-xs font-bold uppercase tracking-widest">Precio Mínimo ({tiendaSeleccionada})</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">{fmtCOP(stats.min)}</p>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <TrendingUp size={18} className="text-red-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Precio Máximo ({tiendaSeleccionada})</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">{fmtCOP(stats.max)}</p>
        </div>

        <div className="bg-[#00e5a0]/10 border border-[#00e5a0]/20 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-[#00e5a0]">
            <Zap size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#00e5a0]">Mejor Oferta Global</span>
          </div>
          <p className="text-lg font-bold text-white leading-tight line-clamp-1">{productoGlobalMasBarato?.nombre}</p>
          <p className="text-sm font-mono text-[#00e5a0] mt-1">{fmtCOP((productoGlobalMasBarato as any).precioNormalizado)} en {productoGlobalMasBarato?.tienda}</p>
        </div>
      </div>

      {/* 2. CONTROLES DE FILTRO */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <Filter size={16} className="text-slate-500" />
            <select
              value={tiendaSeleccionada}
              onChange={(e) => setTiendaSeleccionada(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
            >
              <option value="TODAS">Todas las tiendas</option>
              {stats.tiendas?.map(t => <option key={t} value={t} className="bg-[#1a1a1a]">{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 3. TABLA PROFESIONAL */}
      <div className="max-w-7xl mx-auto bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-bottom border-white/10">
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Producto</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-center">Tienda</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-right">Precio Original</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-right">Precio COP</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-center">Enlace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {productosFiltrados.map((p) => {
                const esEbay = p.tienda.toLowerCase() === 'ebay';
                const esElMasBarato = p._id === productoGlobalMasBarato._id;

                return (
                  <tr key={p._id} className={`hover:bg-white/[0.02] transition-colors ${esElMasBarato ? 'bg-[#00e5a0]/5' : ''}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg p-1 flex-shrink-0">
                          <img src={`http://localhost:3000/proxy-imagen?url=${encodeURIComponent(p.imagen)}`} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-white leading-snug max-w-[200px] block">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase border ${esEbay ? 'border-blue-500/50 text-blue-400' : 'border-[#71b33c]/50 text-[#71b33c]'
                        }`}>
                        {p.tienda}
                      </span>
                    </td>
                    <td className="p-5 text-right font-mono text-sm">
                      {esEbay ? fmtUSD(p.precio) : fmtCOP(p.precio)}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-mono font-bold ${esElMasBarato ? 'text-[#00e5a0]' : 'text-white'}`}>
                          {fmtCOP((p as any).precioNormalizado)}
                        </span>
                        {esElMasBarato && <span className="text-[9px] text-[#00e5a0] font-black uppercase tracking-tighter">Mejor Precio</span>}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex p-2 bg-white/5 hover:bg-[#00e5a0] hover:text-black rounded-lg transition-all text-slate-400">
                        <ExternalLink size={16} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparativaView;