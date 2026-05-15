import { useEffect, useRef, useState } from "react";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
} from "lucide-react";

interface Mensaje {
    tipo: "user" | "bot";
    texto: string;
}

export default function ChatBot() {

    const [abierto, setAbierto] = useState(false);

    const [mensaje, setMensaje] = useState("");

    const [loading, setLoading] = useState(false);

    const [mensajes, setMensajes] = useState<Mensaje[]>([
        {
            tipo: "bot",
            texto:
                `👋 Hola, soy tu asistente IA.

Puedo ayudarte a encontrar:

• Portátiles gamer
• PCs para programación
• Equipos baratos
• Mejor calidad/precio
• Comparativas entre tiendas`,
        },
    ]);

    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }

    }, [mensajes]);

    const enviarMensaje = async () => {

        if (!mensaje.trim()) return;

        const textoUsuario = mensaje;

        setMensajes((prev) => [
            ...prev,
            {
                tipo: "user",
                texto: textoUsuario,
            },
        ]);

        setMensaje("");

        setLoading(true);

        try {

            const res = await fetch("http://localhost:3000/chat-ia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mensaje: textoUsuario,
                }),
            });

            const data = await res.json();

            setMensajes((prev) => [
                ...prev,
                {
                    tipo: "bot",
                    texto: data.respuesta,
                },
            ]);

        } catch (error) {

            setMensajes((prev) => [
                ...prev,
                {
                    tipo: "bot",
                    texto: "❌ Error al conectar con IA",
                },
            ]);

        } finally {

            setLoading(false);
        }
    };

    return (
        <>
            {/* BOTÓN FLOTANTE */}

            {!abierto && (
                <button
                    onClick={() => setAbierto(true)}
                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        border: "none",
                        background:
                            "linear-gradient(135deg,#00e5a0,#00bfff)",
                        color: "white",
                        cursor: "pointer",
                        zIndex: 9999,
                        boxShadow: "0 0 30px rgba(0,229,160,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MessageCircle size={30} />
                </button>
            )}

            {/* CHAT */}

            {abierto && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "380px",
                        height: "650px",
                        background: "#08111f",
                        borderRadius: "24px",
                        overflow: "hidden",
                        zIndex: 9999,
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow:
                            "0 0 50px rgba(0,0,0,0.5)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            padding: "18px",
                            borderBottom:
                                "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background:
                                "linear-gradient(135deg,#00e5a0 0%,#00bfff 100%)",
                        }}
                    >

                        <div>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                    color: "#041018",
                                }}
                            >
                                ScrapeFlow AI
                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#05202e",
                                }}
                            >
                                Recomendador inteligente
                            </div>
                        </div>

                        <button
                            onClick={() => setAbierto(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "#041018",
                            }}
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* MENSAJES */}

                    <div
                        ref={chatRef}
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                        }}
                    >

                        {mensajes.map((m, index) => (

                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        m.tipo === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                }}
                            >

                                <div
                                    style={{
                                        maxWidth: "85%",
                                        background:
                                            m.tipo === "user"
                                                ? "linear-gradient(135deg,#00e5a0,#00bfff)"
                                                : "#111827",
                                        color:
                                            m.tipo === "user"
                                                ? "#041018"
                                                : "white",
                                        padding: "14px",
                                        borderRadius: "18px",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: "1.6",
                                        fontSize: "14px",
                                        border:
                                            m.tipo === "bot"
                                                ? "1px solid rgba(255,255,255,0.05)"
                                                : "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            marginBottom: "8px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {m.tipo === "bot" ? (
                                            <>
                                                <Bot size={16} />
                                                IA
                                            </>
                                        ) : (
                                            <>
                                                <User size={16} />
                                                Tú
                                            </>
                                        )}
                                    </div>

                                    {m.texto}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    color: "#00e5a0",
                                    fontSize: "14px",
                                }}
                            >
                                <Bot size={16} />
                                Escribiendo...
                            </div>
                        )}
                    </div>

                    {/* INPUT */}

                    <div
                        style={{
                            padding: "16px",
                            borderTop:
                                "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            gap: "10px",
                        }}
                    >

                        <input
                            value={mensaje}
                            onChange={(e) =>
                                setMensaje(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !loading) {
                                    e.preventDefault();
                                    enviarMensaje();
                                }
                            }}
                            placeholder="Pregúntame algo..."
                            style={{
                                flex: 1,
                                background: "#0f172a",
                                border:
                                    "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "14px",
                                padding: "14px",
                                color: "white",
                                outline: "none",
                            }}
                        />

                        <button
                            onClick={enviarMensaje}
                            disabled={loading}
                            style={{
                                width: "52px",
                                border: "none",
                                borderRadius: "14px",
                                background:
                                    "linear-gradient(135deg,#00e5a0,#00bfff)",
                                cursor: "pointer",
                                color: "#041018",
                                opacity: loading ? 0.5 : 1,
                                pointerEvents: loading ? "none" : "auto",
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}