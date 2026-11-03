const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export function etiquetaActualizacion(actualizado: string | null | undefined): string | null {
  if (!actualizado) return null
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(actualizado)
  if (!coincidencia) return null
  const mes = MESES[Number(coincidencia[2]) - 1]
  if (!mes) return null
  return `Actualizado el ${Number(coincidencia[3])} de ${mes} de ${coincidencia[1]}`
}
