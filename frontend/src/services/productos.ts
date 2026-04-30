import type { Producto } from "../types/Producto";

const API_URL = "http://localhost:3000/productos";

export const obtenerProductos = async (tienda: string): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}?tienda=${tienda}`);
  const data = await res.json();
  return data;
};