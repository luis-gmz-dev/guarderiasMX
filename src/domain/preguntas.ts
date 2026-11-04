import { sitio } from './sitio'

export interface Pregunta {
  pregunta: string
  respuesta: string
}

export const preguntas: Pregunta[] = [
  {
    pregunta: '¿Este sitio es del IMSS?',
    respuesta:
      'No. Es un mapa independiente. No pertenece al IMSS, no lo representa y no forma parte de sus páginas. Los nombres y las marcas del IMSS son de ellos.',
  },
  {
    pregunta: '¿De dónde salen los datos?',
    respuesta:
      `Del directorio público que el IMSS publica en Excel. En el mapa aparece la fecha de esa copia. El archivo de origen está en ${sitio.fuenteExcel}.`,
  },
  {
    pregunta: '¿Cómo busco una guardería?',
    respuesta:
      'Escribe el nombre, la clave, la colonia o el municipio. También puedes elegir un estado y, después, un municipio. La lista y el mapa muestran las que coinciden.',
  },
  {
    pregunta: '¿Cómo llego a una guardería?',
    respuesta:
      'Ábrela en la lista o en el mapa y pulsa Cómo llegar. Se abre Google Maps con ese destino.',
  },
  {
    pregunta: '¿Guardan mi ubicación?',
    respuesta:
      'No. Si pulsas Mi ubicación, el navegador la usa solo en tu equipo para ordenar por distancia. No se envía a un servidor de este mapa.',
  },
  {
    pregunta: '¿Cada cuánto se actualiza?',
    respuesta:
      'El Excel oficial se revisa cada lunes. Si cambió, el mapa publica la copia nueva y cambia la fecha. Si no cambió, la fecha se queda igual.',
  },
  {
    pregunta: '¿Puedo pagar para aparecer primero?',
    respuesta: 'No. Aparecer en el mapa no tiene costo y nadie puede comprar un lugar en la lista.',
  },
  {
    pregunta: '¿Por qué existe este mapa?',
    respuesta:
      'El directorio oficial está en un Excel. Este mapa lo muestra para buscar una unidad y abrir la ruta. No inscribe ni asigna lugar: solo facilita la consulta de esa lista pública.',
  },
  {
    pregunta: '¿Por qué hay anuncios?',
    respuesta:
      'El sitio es gratuito para quien lo consulta. Google AdSense puede mostrar anuncios para ayudar a cubrir el hospedaje. Esa publicidad no cambia los datos ni el orden de las guarderías.',
  },
  {
    pregunta: '¿Este sitio usa cookies?',
    respuesta:
      'No guarda cookies propias de sesión, porque no hay cuentas. Si se muestra un anuncio, Google puede guardar cookies para medirlo y elegirlo. Puedes limitarlas en tu navegador o en la configuración de anuncios de Google. El detalle está en la página de privacidad.',
  },
  {
    pregunta: '¿Qué hago si la dirección o el teléfono no coinciden?',
    respuesta:
      'Una guardería puede cambiar después de la fecha del directorio. Confirma el dato con la guardería o con el IMSS antes de ir.',
  },
  {
    pregunta: '¿Están todas las guarderías del país?',
    respuesta: 'Están las unidades que vienen en el directorio público del IMSS, no un listado aparte.',
  },
]
