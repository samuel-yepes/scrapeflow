import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Cpu, HardDrive, Monitor, Layers, Box, Filter, Search, RotateCcw, Tag, ChevronDown, ChevronUp } from "lucide-react"; 
import type { Producto } from "../types/Producto";
import { obtenerProductos } from "../services/productos";

function LenovoView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroPrecio, setFiltroPrecio] = useState<number>(0);
  const [busqueda, setBusqueda] = useState("");
  const [maxPrecioOriginal, setMaxPrecioOriginal] = useState(0);
  const [mostrarFiltrosMobi, setMostrarFiltrosMobi] = useState(false);

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
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700">
      
      {/* Header Corporativo Refinado */}
      <header className="max-w-[1600px] mx-auto mb-8 md:mb-12 flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            <span className="text-black">Lenovo </span>
            <span className="text-[#00e5a0] drop-shadow-[0_0_30px_rgba(0,229,160,0.3)]">
              Stock
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 pl-3 sm:pl-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Equipos Activos</span>
            <p className="text-base sm:text-lg font-black text-slate-700 leading-none">{productosFiltrados.length}</p>
          </div>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-[#00e5a0]/10 flex items-center justify-center text-[#00e5a0] border border-[#00e5a0]/20 font-bold">
            <Box size={16} className="sm:size-[20px]" />
          </div>
        </div>
      </header>

      {/* Layout Principal */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-10">
        
        {/* SIDEBAR DE FILTROS (Responsivo) */}
        <aside className="xl:col-span-1">
          <div className="bg-white rounded-3xl xl:rounded-[40px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-6 overflow-hidden">
            
            {/* Header Filtros / Trigger Mobile */}
            <div 
              className="flex items-center justify-between p-5 xl:p-8 cursor-pointer xl:cursor-default border-b border-slate-100 xl:border-none"
              onClick={() => setMostrarFiltrosMobi(!mostrarFiltrosMobi)}
            >
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-3">
                <Filter size={18} className="text-[#00e5a0]" /> Filtros
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); resetFiltros(); }}
                  className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#00e5a0] transition-all active:scale-95"
                >
                  <RotateCcw size={16} />
                </button>
                <div className="xl:hidden text-slate-400">
                  {mostrarFiltrosMobi ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Contenido de Filtros */}
            <div className={`p-6 xl:p-8 pt-2 xl:pt-0 space-y-8 ${mostrarFiltrosMobi ? 'block' : 'hidden xl:block'}`}>
              {/* Búsqueda */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-500 tracking-widest mb-3 block">Modelo o Serie</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00e5a0] transition-colors" size={16} />
                  <input 
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="ThinkPad, Legion..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#00e5a0]/20 outline-none transition-all placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Rango de Precio */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-500 tracking-widest">Presupuesto</label>
                  <span className="text-[11px] font-black px-2 py-0.5 bg-[#00e5a0] text-black rounded-md shadow-sm">
                    {(filtroPrecio / 1000000).toFixed(1)}M
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
                <div className="flex justify-between mt-2 text-[10px] font-bold">
                  <span className="text-slate-300">$0</span>
                  <span className="text-slate-700">${filtroPrecio.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENEDOR DE CARTAS */}
        <div className="xl:col-span-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[450px] bg-white border border-slate-200 rounded-[32px] overflow-hidden">
                  <div className="h-44 bg-slate-100 animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-100 animate-pulse rounded-lg w-3/4" />
                    <div className="grid grid-cols-2 gap-3">
                       <div className="h-10 bg-slate-50 animate-pulse rounded-xl" />
                       <div className="h-10 bg-slate-50 animate-pulse rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-white rounded-3xl xl:rounded-[60px] border border-dashed border-slate-200 px-4 text-center">
              <div className="bg-slate-50 p-5 rounded-full mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-800">Sin resultados</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">No hay equipos Lenovo que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {productosFiltrados.map((p) => {
                const mainSpecs = getMainSpecs(p.especificaciones || {});
                return (
                  <article
                    key={p._id}
                    className="group bg-white rounded-3xl xl:rounded-[40px] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,229,160,0.08)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col overflow-hidden"
                  >
                    {/* Visual de Producto */}
                    <div className="relative h-48 sm:h-56 p-6 sm:p-8 flex items-center justify-center">
                      <div className="absolute top-4 left-4 z-10">
                          <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                            <Tag size={10} className="text-[#00e5a0]" />
                            STOCK
                          </span>
                      </div>
                      <img
                        src={p.imagen ? `${import.meta.env.VITE_API_URL}/proxy-imagen?url=${encodeURIComponent(p.imagen)}` : ""}
                        alt={p.nombre}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=Lenovo")}
                      />
                    </div>

                    {/* Información */}
                    <div className="p-5 sm:p-6 xl:p-8 pt-0 flex-1 flex flex-col">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 mb-4 min-h-[2.5rem] sm:min-h-[3rem] leading-tight">
                        {p.nombre}
                      </h2>

                      {/* Specs Compactas */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <CompactSpec icon={<Cpu size={13}/>} value={mainSpecs.cpu} />
                        <CompactSpec icon={<Layers size={13}/>} value={mainSpecs.ram} />
                        <CompactSpec icon={<HardDrive size={13}/>} value={mainSpecs.ssd} />
                        <CompactSpec icon={<Monitor size={13}/>} value={mainSpecs.pantalla} />
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Precio hoy</p>
                          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            ${p.precio.toLocaleString("es-CO")}
                          </p>
                        </div>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-11 w-11 sm:h-12 sm:w-12 flex items-center justify-center rounded-2xl bg-slate-900 text-[#00e5a0] border border-[#00e5a0]/40 hover:bg-[#00e5a0] hover:text-black transition-all shadow-md active:scale-90 flex-shrink-0"
                        >
                          <ExternalLink size={18} />
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
    <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#fbfcfd] border border-slate-100/70 min-w-0">
      <div className="text-[#00e5a0] shrink-0">{icon}</div>
      <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 truncate" title={value}>{value}</span>
    </div>
  );
}

export default LenovoView;