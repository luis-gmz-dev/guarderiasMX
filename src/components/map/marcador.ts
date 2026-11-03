import type { Guarderia } from '@/types/guarderia'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const mapa: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return mapa[char] ?? char
  })
}

export function htmlMarcador(guarderia: Guarderia): string {
  const lugar = [guarderia.municipio, guarderia.estado].filter(Boolean).join(', ')
  return `<strong>${escapeHtml(guarderia.nombre)}</strong><br>${escapeHtml(guarderia.clave_presupuestal)}${lugar ? `<br>${escapeHtml(lugar)}` : ''}`
}
