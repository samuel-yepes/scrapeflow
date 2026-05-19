import type { Producto } from "../types/Producto";

const API_URL = `${import.meta.env.VITE_API_URL}/productos`;

export const obtenerProductos = async (tienda: string): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}?tienda=${tienda}`);
  const data = await res.json();
  return data;
};