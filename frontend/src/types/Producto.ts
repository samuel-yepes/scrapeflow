export interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  tienda: string;
  url: string;
  imagen: string;
  especificaciones: Record<string, string>;
}