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
  precioNormalizado: number; // Propiedad agregada de forma segura para evitar 'as any'
}

const TASA_CAMBIO = 4000; // Ejemplo: 1 USD = 4000 COP

const ComparativaView: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState<string>("TODAS");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/productos`)
      .then((res) => res.json())
      .then((data: Omit<Producto, "precioNormalizado">[]) => {
        const dataNormalizada: Producto[] = data.map(p => ({
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
    if (productosFiltrados.length === 0) return { min: 0, max: 0, tiendas: [] as string[] };
    const precios = productosFiltrados.map(p => p.precioNormalizado);
    return {
      min: Math.min(...precios),
      max: Math.max(...precios),
      tiendas: Array.from(new Set(productos.map(p => p.tienda)))
    };
  }, [productosFiltrados, productos]);

  const productoGlobalMasBarato = useMemo(() => {
    if (productos.length === 0) return null;
    return [...productos].sort((a, b) => a.precioNormalizado - b.precioNormalizado)[0];
  }, [productos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04080f] flex items-center justify-center p-6">
        <div className="text-center font-mono text-[#00e5a0] animate-pulse tracking-widest text-sm md:text-base">
          CARGANDO MATRIZ DE DATOS CENTRAL...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04080f] text-slate-300 p-4 md:p-10 font-sans selection:bg-[#00e5a0]/30 selection:text-white">
      
      {/* 1. SECCIÓN DE ESTADÍSTICAS RÁPIDAS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#080e1a] border border-white/5 p-5 md:p-6 rounded-2xl relative overflow-hidden group hover:border-[#00e5a0]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <TrendingDown size={18} className="text-[#00e5a0]" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Precio Mínimo ({tiendaSeleccionada})</span>
          </div>
          <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-tight">{fmtCOP(stats.min)}</p>
        </div>

        <div className="bg-[#080e1a] border border-white/5 p-5 md:p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <TrendingUp size={18} className="text-red-400" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Precio Máximo ({tiendaSeleccionada})</span>
          </div>
          <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-tight">{fmtCOP(stats.max)}</p>
        </div>

        <div className="bg-[#00e5a0]/5 border border-[#00e5a0]/15 p-5 md:p-6 rounded-2xl sm:col-span-2 lg:col-span-1 shadow-[0_0_24px_rgba(0,229,160,0.02)]">
          <div className="flex items-center gap-3 mb-2 text-[#00e5a0]">
            <Zap size={18} className="animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest tracking-wider">Mejor Oferta Global</span>
          </div>
          <p className="text-base md:text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-[#00e5a0] transition-colors">{productoGlobalMasBarato?.nombre}</p>
          <p className="text-xs font-mono text-[#00e5a0] mt-1.5 bg-[#00e5a0]/10 px-2 py-0.5 rounded inline-block">
            {productoGlobalMasBarato ? fmtCOP(productoGlobalMasBarato.precioNormalizado) : "$0"} en {productoGlobalMasBarato?.tienda}
          </p>
        </div>
      </div>

      {/* 2. CONTROLES DE FILTRO */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <div className="bg-[#080e1a] px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3 focus-within:border-[#00e5a0]/50 transition-colors">
            <Filter size={16} className="text-slate-400 flex-shrink-0" />
            <select
              value={tiendaSeleccionada}
              onChange={(e) => setTiendaSeleccionada(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer w-full"
            >
              <option value="TODAS" className="bg-[#080e1a] text-white">Todas las tiendas</option>
              {stats.tiendas?.map(t => (
                <option key={t} value={t} className="bg-[#080e1a] text-white">{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500 text-right hidden sm:block">
          Mostrando {productosFiltrados.length} de {productos.length} registros
        </div>
      </div>

      {/* 3. VISUALIZACIÓN DE DATOS (RESPONSIVA) */}
      <div className="max-w-7xl mx-auto">
        
        {/* ── MÓVIL: VISTA EN TARJETAS (Oculta en md) ── */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {productosFiltrados.map((p) => {
            const esEbay = p.tienda.toLowerCase() === 'ebay';
            const esElMasBarato = productoGlobalMasBarato && p._id === productoGlobalMasBarato._id;

            return (
              <div 
                key={p._id} 
                className={`bg-[#080e1a] border rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden transition-all duration-200 ${
                  esElMasBarato ? 'border-[#00e5a0] bg-[#00e5a0]/[0.02] shadow-[0_0_20px_rgba(0,229,160,0.05)]' : 'border-white/5'
                }`}
              >
                {esElMasBarato && (
                  <div className="absolute top-0 right-0 bg-[#00e5a0] text-black text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    MEJOR PRECIO
                  </div>
                )}

                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}/proxy-imagen?url=${encodeURIComponent(p.imagen)}`} 
                      alt="" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1 border ${
                      esEbay ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-[#71b33c]/30 text-[#71b33c] bg-[#71b33c]/5'
                    }`}>
                      {p.tienda}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 pr-12">{p.nombre}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 bg-white/[0.02] border border-white/5 rounded-xl p-3 text-sm">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Original</span>
                    <span className="font-mono text-slate-300">{esEbay ? fmtUSD(p.precio) : fmtCOP(p.precio)}</span>
                  </div>
                  <div className="text-right border-l border-white/5 pl-3">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Normalizado COP</span>
                    <span className={`font-mono font-bold ${esElMasBarato ? 'text-[#00e5a0]' : 'text-white'}`}>
                      {fmtCOP(p.precioNormalizado)}
                    </span>
                  </div>
                </div>

                <a 
                  href={p.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    esElMasBarato 
                      ? 'bg-[#00e5a0] text-black hover:bg-[#00e5a0]/90' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>Ver en tienda</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>

        {/* ── ESCRITORIO: TABLA PREMIUM (Oculta en móvil) ── */}
        <div className="hidden md:block bg-[#080e1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10">
                  <th className="p-4 lg:p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Producto</th>
                  <th className="p-4 lg:p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-center">Tienda</th>
                  <th className="p-4 lg:p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-right">Precio Original</th>
                  <th className="p-4 lg:p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-right">Precio COP</th>
                  <th className="p-4 lg:p-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-center">Enlace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {productosFiltrados.map((p) => {
                  const esEbay = p.tienda.toLowerCase() === 'ebay';
                  const esElMasBarato = productoGlobalMasBarato && p._id === productoGlobalMasBarato._id;

                  return (
                    <tr key={p._id} className={`hover:bg-white/[0.01] transition-colors duration-150 ${esElMasBarato ? 'bg-[#00e5a0]/[0.03]' : ''}`}>
                      <td className="p-4 lg:p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center shadow-md">
                            <img src={`${import.meta.env.VITE_API_URL}/proxy-imagen?url=${encodeURIComponent(p.imagen)}`} alt="" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-bold text-white leading-snug max-w-sm lg:max-w-xl line-clamp-2">{p.nombre}</span>
                        </div>
                      </td>
                      <td className="p-4 lg:p-5 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase border tracking-wider ${
                          esEbay ? 'border-blue-500/40 text-blue-400 bg-blue-500/5' : 'border-[#71b33c]/40 text-[#71b33c]/90 bg-[#71b33c]/5'
                        }`}>
                          {p.tienda}
                        </span>
                      </td>
                      <td className="p-4 lg:p-5 text-right font-mono text-sm text-slate-300 whitespace-nowrap">
                        {esEbay ? fmtUSD(p.precio) : fmtCOP(p.precio)}
                      </td>
                      <td className="p-4 lg:p-5 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          <span className={`font-mono font-bold ${esElMasBarato ? 'text-[#00e5a0] text-base' : 'text-white'}`}>
                            {fmtCOP(p.precioNormalizado)}
                          </span>
                          {esElMasBarato && (
                            <span className="text-[9px] text-[#00e5a0] font-black uppercase tracking-wider mt-0.5">Mejor Precio</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 lg:p-5 text-center whitespace-nowrap">
                        <a 
                          href={p.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex p-2.5 bg-white/5 hover:bg-[#00e5a0] hover:text-black rounded-xl transition-all duration-200 text-slate-400 hover:scale-105"
                        >
                          <ExternalLink size={15} />
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
    </div>
  );
};

export default ComparativaView;