import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Cpu, HardDrive, Monitor, Layers, Box, Filter, Search, RotateCcw, Tag } from "lucide-react"; 
import type { Producto } from "../types/Producto";
import { obtenerProductos } from "../services/productos";

function LenovoView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroPrecio, setFiltroPrecio] = useState<number>(0);
  const [busqueda, setBusqueda] = useState("");
  const [maxPrecioOriginal, setMaxPrecioOriginal] = useState(0);

  useEffect(() => {
    obtenerProductos("Lenovo").then((data) => {
      setProductos(data);
      if (data.length > 0) {
        const max = Math.max(...data.map((p: Producto) => p.precio));
        setMaxPrecioOriginal(max);
        setFiltroPrecio(max);
      }
      setLoading(false);
    });
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const cumplePrecio = p.precio <= filtroPrecio;
      const cumpleBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return cumplePrecio && cumpleBusqueda;
    });
  }, [productos, filtroPrecio, busqueda]);

  const resetFiltros = () => {
    setFiltroPrecio(maxPrecioOriginal);
    setBusqueda("");
  };

  const getMainSpecs = (specs: any = {}) => {
    const cpuRaw = specs["Procesador específico txt"] || specs["Procesador"] || "N/A";
    const ramRaw = specs["Memoria RAM"] || specs["Memoria total"] || "N/A";
    const ssdRaw = specs["Capacidad de almacenamiento"] || specs["Unidad de disco primaria"] || "N/A";
    const pantallaRaw = specs["Tamaño de la pantalla"] || specs["Tipo de pantalla"] || "N/A";

    return {
      cpu: cpuRaw?.length > 25 ? cpuRaw.substring(0, 25) + "…" : cpuRaw,
      ram: ramRaw,
      ssd: ssdRaw,
      pantalla: pantallaRaw?.includes('"') ? pantallaRaw : `${pantallaRaw?.substring(0, 8)}...`,
    };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 animate-in fade-in duration-700">
      {/* Header Corporativo Refinado */}
      <header className="max-w-[1600px] mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-black">Lenovo </span>
            <span className="text-[#00e5a0] drop-shadow-[0_0_30px_rgba(0,229,160,0.3)]">
              Stock
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Equipos Activos</span>
            <p className="text-lg font-black text-slate-700 leading-none">{productosFiltrados.length}</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-[#00e5a0]/10 flex items-center justify-center text-[#00e5a0] border border-[#00e5a0]/20 font-bold">
            <Box size={20} />
          </div>
        </div>
      </header>

      {/* Layout Principal */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-5 gap-10">
        
        {/* SIDEBAR DE FILTROS */}
        <aside className="xl:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                <Filter size={20} className="text-[#00e5a0]" /> Filtros
              </h3>
              <button 
                onClick={resetFiltros}
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#00e5a0] transition-all active:scale-95"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="space-y-10">
              {/* Búsqueda */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest mb-4 block">Modelo o Serie</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00e5a0] transition-colors" size={18} />
                  <input 
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="ThinkPad, Legion..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#00e5a0]/20 outline-none transition-all placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Rango de Precio */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Presupuesto</label>
                  <span className="text-xs font-black px-2.5 py-1 bg-[#00e5a0] text-black rounded-lg shadow-sm">
                    ${(filtroPrecio / 1000000).toFixed(1)}M
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max={maxPrecioOriginal}
                  step="100000"
                  value={filtroPrecio}
                  onChange={(e) => setFiltroPrecio(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#00e5a0]"
                />
                <div className="flex justify-between mt-3 text-[10px] font-bold">
                  <span className="text-slate-300">$0</span>
                  <span className="text-slate-700">${filtroPrecio.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENEDOR DE CARTAS (3 Columnas) */}
        <div className="xl:col-span-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[500px] bg-white border border-slate-200 rounded-[32px] overflow-hidden">
                  <div className="h-48 bg-slate-100 animate-pulse" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-slate-100 animate-pulse rounded-lg w-3/4" />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-12 bg-slate-50 animate-pulse rounded-xl" />
                       <div className="h-12 bg-slate-50 animate-pulse rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[60px] border border-dashed border-slate-200 shadow-sm">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                <Search className="text-slate-300" size={40} />
              </div>
              <p className="text-2xl font-black text-slate-800">Sin resultados</p>
              <p className="text-slate-400 mt-2 font-medium">No hay equipos Lenovo que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productosFiltrados.map((p) => {
                const mainSpecs = getMainSpecs(p.especificaciones || {});
                return (
                  <article
                    key={p._id}
                    className="group bg-white rounded-[40px] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,229,160,0.1)] transition-all duration-700 hover:-translate-y-2 flex flex-col overflow-hidden"
                  >
                    {/* Visual de Producto */}
                    <div className="relative h-60 p-10 flex items-center justify-center">
                      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                          <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                            <Tag size={12} className="text-[#00e5a0]" />
                            STOCK
                          </span>
                      </div>
                      <img
                        src={p.imagen ? `${import.meta.env.VITE_API_URL}/proxy-imagen?url=${encodeURIComponent(p.imagen)}` : ""}
                        alt={p.nombre}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=Lenovo")}
                      />
                    </div>

                    {/* Información */}
                    <div className="px-8 pb-8 flex-1 flex flex-col">
                      <h2 className="text-base font-bold text-slate-900 line-clamp-2 mb-6 min-h-[3rem] transition-colors">
                        {p.nombre}
                      </h2>

                      {/* Specs Compactas */}
                      <div className="grid grid-cols-2 gap-2 mb-8">
                        <CompactSpec icon={<Cpu size={14}/>} value={mainSpecs.cpu} />
                        <CompactSpec icon={<Layers size={14}/>} value={mainSpecs.ram} />
                        <CompactSpec icon={<HardDrive size={14}/>} value={mainSpecs.ssd} />
                        <CompactSpec icon={<Monitor size={14}/>} value={mainSpecs.pantalla} />
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Precio hoy</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">
                            ${p.precio.toLocaleString("es-CO")}
                          </p>
                        </div>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-14 w-14 flex items-center justify-center rounded-3xl bg-slate-900 text-[#00e5a0] border border-[#00e5a0]/40 hover:bg-[#00e5a0] hover:text-black transition-all shadow-lg shadow-slate-200 active:scale-90"
                        >
                          <ExternalLink size={22} />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </main>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactSpec({ icon, value }: { icon: any, value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#fbfcfd] border border-slate-100/50">
      <div className="text-[#00e5a0] shrink-0">{icon}</div>
      <span className="text-[11px] font-bold text-slate-600 truncate" title={value}>{value}</span>
    </div>
  );
}

export default LenovoView;