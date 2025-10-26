export interface Contratista {
  id: number;
  nombre: string;
  cedula: string;
  empresa?: string;
  fecha_expiracion_praind?: string;
}

export interface Vehiculo {
  numero_placa: string;
  marca: string;
}

export interface FormularioIngreso {
  contratista_id: number;
  vehiculo: string;
  autorizacion: "PRAIND" | "Temporal" | "Visitante";
  gafete: string;
}
