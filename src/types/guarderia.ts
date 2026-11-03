export interface Guarderia {
  id: string
  clave_presupuestal: string
  nombre: string
  horario_atencion: string | null
  telefono: string | null
  calle: string | null
  numero_exterior: string | null
  numero_interior: string | null
  estado: string | null
  localidad: string | null
  municipio: string | null
  colonia: string | null
  codigo_postal: string | null
  latitud: number
  longitud: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface GuarderiaInput {
  clave_presupuestal: string
  nombre: string
  horario_atencion: string | null
  telefono: string | null
  calle: string | null
  numero_exterior: string | null
  numero_interior: string | null
  estado: string | null
  localidad: string | null
  municipio: string | null
  colonia: string | null
  codigo_postal: string | null
  latitud: number
  longitud: number
}

export interface AdvertenciaImportacion {
  clave_presupuestal: string
  mensaje: string
}

export interface ResultadoLote {
  filas: GuarderiaInput[]
  advertencias: AdvertenciaImportacion[]
}

export interface ResultadoImportacion {
  insertados: number
  actualizados: number
  advertencias: AdvertenciaImportacion[]
}

export interface Importacion {
  id: string
  archivo: string | null
  total_filas: number
  insertados: number
  actualizados: number
  estado: 'ok' | 'error'
  detalle: { advertencias?: AdvertenciaImportacion[] } | null
  created_at: string
}

export interface Coordenadas {
  latitud: number
  longitud: number
}
