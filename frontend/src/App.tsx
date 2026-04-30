import { useState } from "react";
import { ChevronRight, Globe, Database, ShieldCheck, Zap, Home as HomeIcon } from "lucide-react"; 
import FalabellaView from "./components/FalabellaView";
import LenovoView from "./components/lenovo";
import TecnoclifeView from "./components/tecnolife";
import Ebay from "./components/ebay";

function Home() {
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState("Inicio");

  // RUTA DEL LOGO
  const logoPath = "/logo_scrapeflow-removebg-preview.png";

  const tiendas = [
    {
      key: "Falabella",
      label: "Falabella",
      subtitle: "Comparativa de portátiles",
      icon: <Database className="text-indigo-400" />,
    },
    {
      key: "Lenovo",
      label: "Lenovo",
      subtitle: "ThinkPads oficiales",
      icon: <ShieldCheck className="text-indigo-400" />,
    },
    {
      key: "Ebay",
      label: "Ebay",
      subtitle: "Hardware internacional",
      icon: <Globe className="text-indigo-400" />,
    },
    {
      key: "Tecnoclife",
      label: "Tecnoclife",
      subtitle: "Stock nacional",
      icon: <Zap className="text-indigo-400" />,
    },
  ];

  const renderLanding = () => (
    <main className="animate-in fade-in duration-700">
      <section className="relative overflow-hidden bg-slate-950 pb-24 pt-16 text-white sm:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 blur-[120px] opacity-20">
          <div className="aspect-[1100/600] w-[70rem] bg-gradient-to-tr from-[#4f46e5] to-[#80caff]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              {/* Eliminado el logo repetido aquí para mejorar la limpieza visual */}
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                Scrape<span className="text-indigo-500">Flow</span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-lg">
                Inteligencia de mercado consolidada. Compara, analiza y gestiona portátiles desde los principales distribuidores en un solo flujo de trabajo profesional.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 pr-8">
                   <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400"><Database size={20}/></div>
                   <div>
                     <p className="text-xs uppercase text-slate-400 font-bold">Fuente de Datos</p>
                     <p className="font-medium text-white">Consolidada</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 pr-8">
                   <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400"><Zap size={20}/></div>
                   <div>
                     <p className="text-xs uppercase text-slate-400 font-bold">Velocidad</p>
                     <p className="font-medium text-white">Tiempo Real</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="rounded-[40px] border border-white/10 bg-slate-900/50 p-10 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
              <h2 className="text-2xl font-bold text-white mb-6">Inicia una sesión</h2>
              <div className="grid gap-4">
                {tiendas.map((tienda) => (
                  <button
                    key={tienda.key}
                    onClick={() => setTiendaSeleccionada(tienda.key)}
                    className="group relative flex items-center justify-between rounded-3xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-indigo-500/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-slate-800 p-3 group-hover:scale-110 transition-transform">
                        {tienda.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white tracking-wide">{tienda.label}</p>
                        <p className="text-sm text-slate-400">{tienda.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Capacidades de monitoreo</h2>
            <div className="mt-4 h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Actualización en tiempo real",
              "Mapeo de especificaciones",
              "Seguimiento de stock",
              "Exportación directa",
            ].map((feature, idx) => (
              <div key={idx} className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 inline-block rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Sistema optimizado para la identificación rápida de laptops bajo demanda.
                </p>
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
      case "Tecnoclife": return <TecnoclifeView />;
      default: return renderLanding();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-24 items-center justify-between px-6">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setTiendaSeleccionada("Inicio")}
          >
            {/* Logo del Header: Más grande y llenando el cuadrado */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100 transition-transform group-hover:scale-105">
              {logoPath ? (
                <img 
                  src={logoPath} 
                  alt="ScrapeFlow Logo" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <span className="font-bold text-indigo-600 text-2xl">S</span>
              )}
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">ScrapeFlow</p>
            </div>
          </div>

          <nav className="hidden md:block">
            <button
              onClick={() => setTiendaSeleccionada("Inicio")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                tiendaSeleccionada === "Inicio" 
                ? "bg-slate-900 text-white shadow-lg" 
                : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HomeIcon size={18} />
              Panel General
            </button>
          </nav>
        </div>
      </header>

      {renderVista()}

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 ScrapeFlow Project - Herramienta de Auditoría de Hardware.
        </div>
      </footer>
    </div>
  );
}

export default Home;