// src/common/enums/gafetes.enums.ts

export enum EstadoGafete {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  BLOQUEADO = 'BLOQUEADO',
  PERDIDO = 'PERDIDO',
}

export enum EstadoDevolucionGafete {
  PENDIENTE = 'PENDIENTE',
  DEVUELTO = 'DEVUELTO',
  PERDIDO = 'PERDIDO',
  DAÑADO = 'DAÑADO',
  BUENO = 'BUENO',
}

export enum TipoGafete {
  PERSONAL = 'PERSONAL',
  CONTRATISTA = 'CONTRATISTA',
  VISITANTE = 'VISITANTE',
  PROVEEDOR = 'PROVEEDOR',
}
