const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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
    await Producto.findOneAndUpdate(
      { url: req.body.url },
      req.body,
      { upsert: true, new: true }
    );
    res.send("Producto insertado/actualizado");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

app.get("/productos", async (req, res) => {
  let tienda = req.query.tienda;
  if (Array.isArray(tienda)) tienda = tienda[0];
  tienda = tienda ? String(tienda).trim() : "";

  console.log("GET /productos", { tienda });

  const filtro = tienda
    ? { tienda: { $regex: `^${escapeRegex(tienda)}$`, $options: "i" } }
    : {};

  const productos = await Producto.find(filtro);
  res.json(productos);
});

// 🔥 NUEVO: Proxy de imágenes para evitar bloqueo de Falabella
app.get("/proxy-imagen", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Falta url");

  try {
    const response = await fetch(decodeURIComponent(url), {
      
      headers: {
        "Referer": "https://www.falabella.com.co/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) return res.status(response.status).send("Error al obtener imagen");

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400"); // Cache 1 día
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));