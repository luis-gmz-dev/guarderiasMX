export function textoBusqueda(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es-MX')
}

export function coincide(texto: string, consulta: string): boolean {
  const q = textoBusqueda(consulta.trim())
  if (!q) return true
  return textoBusqueda(texto).includes(q)
}
