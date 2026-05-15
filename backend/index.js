require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQAPI_KEY,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a Mongo"))
  .catch((err) => console.log(err));

const Producto = mongoose.model("Producto", {
  nombre: String,
  precio: Number,
  tienda: String,
  url: { type: String, unique: true, required: true },
  imagen: String,
  especificaciones: Object,
});

app.post("/productos", async (req, res) => {
  try {
    if (!req.body.url) return res.send("Error: URL vacía");

    await Producto.findOneAndUpdate({ url: req.body.url }, req.body, {
      upsert: true,
      new: true,
    });

    res.send("Producto insertado/actualizado");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

app.get("/productos", async (req, res) => {
  let tienda = req.query.tienda;

  if (Array.isArray(tienda)) tienda = tienda[0];

  tienda = tienda ? String(tienda).trim() : "";

  const filtro = tienda
    ? {
        tienda: {
          $regex: `^${escapeRegex(tienda)}$`,
          $options: "i",
        },
      }
    : {};

  const productos = await Producto.find(filtro);

  res.json(productos);
});

// ==========================================
// IA CHATBOT
// ==========================================

app.post("/chat-ia", async (req, res) => {
  try {

    const { mensaje } = req.body;

    // 🔥 traer productos reales de Mongo
    const productos = await Producto.find()
      .sort({ precio: 1 })
      .limit(40);

    const contextoProductos = productos.map((p) => {
      return `
        Nombre: ${p.nombre}
        Precio: ${p.precio}
        Tienda: ${p.tienda}
        `;
            }).join("\n");

    const completion = await groq.chat.completions.create({

      messages: [

        {
          role: "system",
          content: `
            Eres el asistente IA premium de ScrapeFlow.

            Tu trabajo es recomendar laptops REALES que existen en la base de datos.

            REGLAS IMPORTANTES:

            - SOLO puedes recomendar productos del contexto.
            - NO inventes laptops.
            - Responde corto y moderno.
            - Máximo 3 recomendaciones.
            - Usa emojis moderadamente.
            - Organiza bonito.
            - NO escribas párrafos gigantes.
            - SI el usuario pide programar:
              prioriza ThinkPads, Ryzen 5+, Intel i5+, 16GB RAM.
            - SI pide gaming:
              prioriza RTX y buena refrigeración.
            - SI pide barato:
              prioriza menor precio.
            - SI no encuentras algo exacto:
              recomienda lo más cercano.

            FORMATO:

            💻 Nombre

            💰 Precio  
            🏪 Tienda

            ━━━━━━━━━━

            Productos disponibles:

${contextoProductos}
`,
        },

        {
          role: "user",
          content: mensaje,
        },

      ],

      model: "llama-3.3-70b-versatile",

      temperature: 0.7,

      max_tokens: 500,
    });

    res.json({
      respuesta: completion.choices[0].message.content,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error con IA",
    });
  }
});

// ==========================================
// PROXY IMAGENES
// ==========================================

app.get("/proxy-imagen", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("Falta url");

  try {
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        Referer: "https://www.falabella.com.co/",
        "User-Agent": "Mozilla/5.0",
      },
    });

    const buffer = await response.arrayBuffer();

    const contentType = response.headers.get("content-type") || "image/jpeg";

    res.set("Content-Type", contentType);

    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
