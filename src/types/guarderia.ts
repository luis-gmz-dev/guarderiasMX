export interface Guarderia {
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

export type GuarderiaInput = Guarderia

export interface AdvertenciaImportacion {
  clave_presupuestal: string
  mensaje: string
}

export interface ResultadoLote {
  filas: GuarderiaInput[]
  advertencias: AdvertenciaImportacion[]
}

export interface Coordenadas {
  latitud: number
  longitud: number
}
