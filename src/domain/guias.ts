import { sitio } from './sitio'

export interface Referencia {
  titulo: string
  url: string
}

export interface ParrafoGuia {
  tipo: 'p' | 'h2' | 'lista'
  texto?: string
  items?: string[]
}

export interface Guia {
  slug: string
  titulo: string
  descripcion: string
  bloques: ParrafoGuia[]
  referencias: Referencia[]
}

const leySeguroSocial: Referencia = {
  titulo: 'Ley del Seguro Social (Cámara de Diputados)',
  url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf',
}

const tramiteInscripcion: Referencia = {
  titulo: 'Trámite IMSS-01-006, solicitud de inscripción a guardería',
  url: 'https://www.imss.gob.mx/tramites/imss01006',
}

const paginaGuarderias: Referencia = {
  titulo: 'Guarderías del IMSS',
  url: 'https://www.imss.gob.mx/guarderias',
}

const directorioExcel: Referencia = {
  titulo: 'Directorio público de guarderías (Excel del IMSS)',
  url: sitio.fuenteExcel,
}

export const guias: Guia[] = [
  {
    slug: 'quien-tiene-derecho',
    titulo: 'Quién tiene derecho a la guardería del IMSS',
    descripcion:
      'Mamá o papá asegurado en el régimen obligatorio puede pedir el servicio. No es un trámite de este mapa.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Este texto resume reglas públicas del IMSS. No es un sitio oficial. El derecho y el cupo se confirman en la guardería o en el trámite IMSS-01-006.',
      },
      {
        tipo: 'h2',
        texto: 'Quién puede pedirlo',
      },
      {
        tipo: 'p',
        texto:
          'Tiene derecho la persona trabajadora asegurada en el régimen obligatorio que esté vigente, sea mamá o papá. Los artículos 201 y 205 de la Ley del Seguro Social, con la reforma publicada el 21 de octubre de 2020, igualan a ambos. Ya no hace falta ser viudo, divorciado o tener una sentencia para que un padre asegurado pueda solicitarlo.',
      },
      {
        tipo: 'p',
        texto:
          'Si quien pide el servicio ejerce la patria potestad y tiene la custodia por resolución judicial, lleva esa resolución. El niño o la niña debe estar registrado como beneficiario de esa persona asegurada.',
      },
      {
        tipo: 'h2',
        texto: 'Edad',
      },
      {
        tipo: 'p',
        texto:
          'El servicio atiende de los 43 días de nacidos hasta los cuatro años. En el área de apoyo terapéutico de una guardería integradora el límite llega a los seis años, con la valoración que pide el Instituto.',
      },
      {
        tipo: 'h2',
        texto: 'Si pierdes el empleo',
      },
      {
        tipo: 'p',
        texto:
          'La Ley del Seguro Social prevé conservar el servicio por un tiempo corto después de la baja (artículo 207). El otro padre o madre asegurado puede, en su caso, pedir el cambio de titularidad. Esos plazos y requisitos los aplica el IMSS, no este mapa.',
      },
    ],
    referencias: [leySeguroSocial, paginaGuarderias, directorioExcel],
  },
  {
    slug: 'requisitos-e-inscripcion',
    titulo: 'Requisitos e inscripción a una guardería del IMSS',
    descripcion:
      'Documentos del trámite IMSS-01-006, edad y cómo se registra la solicitud. Confírmalo en el IMSS; este mapa no inscribe.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La inscripción no se hace aquí. Este mapa solo muestra el directorio público. El trámite oficial es la solicitud de inscripción a guarderías IMSS-01-006.',
      },
      {
        tipo: 'h2',
        texto: 'Qué llevar del niño o la niña',
      },
      {
        tipo: 'lista',
        items: [
          'Acta de nacimiento (original o copia certificada para cotejo y copia simple para el expediente).',
          'CURP, si el acta no la trae.',
          'Cartilla nacional de salud, original para cotejo.',
          'Solicitud de examen médico de admisión requisitada.',
          'Si pides el área de apoyo terapéutico de una integradora, la valoración del desarrollo para asignar grupo.',
        ],
      },
      {
        tipo: 'h2',
        texto: 'Qué llevar de la persona asegurada',
      },
      {
        tipo: 'lista',
        items: [
          'Número de seguridad social, CURP e identificación oficial con fotografía.',
          'Domicilio, teléfonos, correo (el seguimiento llega a ese correo) y unidad médica de adscripción.',
          'Datos del trabajo: nombre o razón social, domicilio y teléfonos.',
          'Solicitud de inscripción y constancia de la plática de nuevo ingreso.',
          'Si aplica, la resolución judicial de patria potestad y custodia.',
        ],
      },
      {
        tipo: 'h2',
        texto: 'Personas autorizadas para recoger',
      },
      {
        tipo: 'p',
        texto:
          'Puedes registrar de una a tres personas mayores de edad, con identificación oficial y CURP, para entregar y recoger al niño o a la niña.',
      },
      {
        tipo: 'h2',
        texto: 'Cómo se pide el lugar',
      },
      {
        tipo: 'p',
        texto:
          'La solicitud se registra en la guardería que elijas o en el sistema de inscripción del IMSS (stigi.imss.gob.mx), en el horario que el Instituto publique. Si no hay cupo, te dan un folio de lista de espera. El formato oficial indica que, con cupo y con toda la documentación, la resolución tarda dos días hábiles. Lleva dos tantos de la solicitud: uno para el expediente y otro para ti.',
      },
      {
        tipo: 'p',
        texto:
          'La ficha del trámite está en imss.gob.mx/tramites/imss01006. Teléfonos de orientación que publica el Instituto: 800 623 2323 y, para el servicio de guardería, 800 900 1300.',
      },
    ],
    referencias: [tramiteInscripcion, paginaGuarderias, directorioExcel],
  },
  {
    slug: 'costo-y-horario',
    titulo: 'Costo y horario de las guarderías del IMSS',
    descripcion:
      'El servicio no tiene colegiatura. El horario de cada unidad sale del directorio público que muestra este mapa.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Nadie te debe cobrar colegiatura, inscripción ni un “apartado” por el horario que cubre el IMSS. El seguro de guarderías lo paga el patrón. Si te piden cuotas, donativos o material obligatorio por ese horario, es un abuso: el Instituto publica canales de queja para reportarlo.',
      },
      {
        tipo: 'h2',
        texto: 'Cómo es el horario',
      },
      {
        tipo: 'p',
        texto:
          'La descripción oficial del servicio habla de lunes a viernes, salvo días de descanso obligatorio, con nueve horas en turno matutino o vespertino según la unidad. En el esquema integrador son diez horas. No hay servicio nocturno por disposición de ley. Los centros en empresa pueden tener un mínimo de diez horas.',
      },
      {
        tipo: 'p',
        texto:
          'Cada unidad tiene el horario que autorizó el IMSS. En este directorio hay decenas de rangos distintos; el más frecuente es 07:00 a 16:00. Ábrela en el mapa y mira el campo de horario antes de elegir. Conviene que cubra tu entrada, tu salida y el traslado.',
      },
      {
        tipo: 'h2',
        texto: 'Comidas y recoger tarde',
      },
      {
        tipo: 'p',
        texto:
          'Si el niño o la niña no llega al menos quince minutos antes de una comida, esa comida no se da. Hay que recogerlo dentro del horario. Las disposiciones del Instituto prevén que, si pasan sesenta minutos después del cierre y no localizan a ti ni a las personas autorizadas, la dirección debe presentarlo ante el Ministerio Público.',
      },
    ],
    referencias: [paginaGuarderias, directorioExcel, leySeguroSocial],
  },
  {
    slug: 'esquemas',
    titulo: 'Qué significa la letra en el nombre de la guardería',
    descripcion:
      'En este directorio el nombre suele empezar con una letra: U, G, M, E, N o C. No cambia que el servicio sea del IMSS.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'El Excel público pone al inicio del nombre una letra y un número. Esa letra indica el esquema de la unidad en esta copia. Para ti el trámite es el mismo y el servicio no se cobra. La letra no es un ranking ni un sello de este mapa.',
      },
      {
        tipo: 'h2',
        texto: 'Letras que el IMSS nombra en su normativa',
      },
      {
        tipo: 'lista',
        items: [
          'U: vecinal comunitario único. La operan particulares con contrato o convenio del IMSS. Es la más frecuente en este directorio.',
          'G: ordinaria. El IMSS la opera con personal propio y está abierta a personas aseguradas del régimen obligatorio.',
          'M: Madres IMSS. Solo para personal del Instituto, según el contrato colectivo. Se pide por la vía sindical, no como el resto.',
          'E: en empresa. El patrón instala el centro con convenio del IMSS.',
          'N: centro de educación y cuidado infantil (CECI) del IMSS.',
          'C: en esta copia aparecen unidades con nombres de centros del campo.',
        ],
      },
      {
        tipo: 'h2',
        texto: 'Otras letras de este archivo',
      },
      {
        tipo: 'p',
        texto:
          'También hay nombres que empiezan con Y, A o R. Aquí solo se reporta esa letra tal como viene en el Excel. No les ponemos un nombre legal que el directorio no trae. Si el IMSS cambia el catálogo, la copia del lunes siguiente lo refleja.',
      },
    ],
    referencias: [directorioExcel, paginaGuarderias],
  },
  {
    slug: 'como-usar-el-mapa',
    titulo: 'Cómo usar este mapa de guarderías',
    descripcion:
      'Busca por nombre, clave o lugar, abre la ficha y pasa a Google Maps. Los datos salen del Excel público del IMSS.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Esta página describe solo este sitio. No es el buscador del IMSS ni inscribe a nadie. Los nombres, horarios y teléfonos son los de la copia del directorio público que se indica en el mapa.',
      },
      { tipo: 'h2', texto: 'Buscar' },
      {
        tipo: 'lista',
        items: [
          'Escribe nombre, clave presupuestal, colonia o municipio.',
          'Elige un estado y, si quieres, un municipio. Sin estado no hay lista de municipios.',
          'En el teléfono, Filtros abre estado y municipio. En pantalla ancha están siempre visibles.',
        ],
      },
      { tipo: 'h2', texto: 'La ficha y la ruta' },
      {
        tipo: 'p',
        texto:
          'Al elegir una unidad ves clave, horario, teléfono y dirección tal como vienen en el Excel. Cómo llegar abre Google Maps con las coordenadas de esa fila. Mi ubicación ordena por distancia en tu navegador y no se envía a un servidor de este mapa.',
      },
      { tipo: 'h2', texto: 'Qué no hace' },
      {
        tipo: 'p',
        texto:
          'No reserva lugar, no cobra y no cambia el orden porque alguien pague. Si el dato no está en el Excel, aquí no se inventa. Confirma domicilio y horario con la guardería o con el IMSS antes de ir.',
      },
    ],
    referencias: [directorioExcel, paginaGuarderias],
  },
  {
    slug: 'como-leer-el-directorio',
    titulo: 'Cómo leer una fila del directorio',
    descripcion:
      'Qué significa cada dato que ves en la ficha: clave, horario, teléfono y dirección. Salen del Excel del IMSS.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Cada ficha de este mapa es una fila del directorio público. No se agregan columnas propias. Si un campo viene vacío en el Excel, la ficha no lo completa.',
      },
      { tipo: 'h2', texto: 'Los campos que se muestran' },
      {
        tipo: 'lista',
        items: [
          'Nombre, con la letra de esquema y el número que trae el archivo.',
          'Clave presupuestal, el identificador de esa unidad en el directorio.',
          'Horario autorizado en esa fila. Hay muchos rangos; no hay un horario único para todo el país.',
          'Teléfono y dirección (colonia, municipio y estado) cuando el Excel los trae.',
          'Coordenadas, que Cómo llegar usa como destino en Google Maps.',
        ],
      },
      { tipo: 'h2', texto: 'La fecha de la copia' },
      {
        tipo: 'p',
        texto:
          'El mapa muestra la fecha de la copia publicada aquí. El Excel oficial se revisa cada lunes. Si el archivo no cambió, la fecha se queda. Si cambió, se reemplaza la copia.',
      },
    ],
    referencias: [directorioExcel, paginaGuarderias],
  },
  {
    slug: 'lista-de-espera',
    titulo: 'Lista de espera y cupo',
    descripcion:
      'Si no hay lugar, el IMSS da un folio de espera. Este mapa no administra cupos ni folios.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'El cupo lo decide la guardería y el IMSS, no esta página. Lo que sigue resume el trámite público IMSS-01-006. Confírmalo en la ficha oficial antes de ir.',
      },
      { tipo: 'h2', texto: 'Si hay lugar' },
      {
        tipo: 'p',
        texto:
          'Con cupo y con la documentación completa, el formato del trámite indica una resolución en dos días hábiles. La solicitud se registra en la guardería que elijas o en el sistema de inscripción del IMSS.',
      },
      { tipo: 'h2', texto: 'Si no hay lugar' },
      {
        tipo: 'p',
        texto:
          'Te entregan un folio de lista de espera. Ese folio y el avance se consultan con el IMSS, no en este mapa. Elegir otra unidad del directorio es una búsqueda aparte: aquí solo ves cuáles existen en el Excel.',
      },
    ],
    referencias: [tramiteInscripcion, paginaGuarderias, directorioExcel],
  },
  {
    slug: 'si-el-dato-no-coincide',
    titulo: 'Si la dirección o el teléfono no coinciden',
    descripcion:
      'El mapa muestra la copia del Excel. Un cambio posterior hay que confirmarlo con la guardería o con el IMSS.',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Este sitio no recibe correcciones de particulares para reescribir una fila. La fuente es el directorio que publica el IMSS. Si el Excel cambia, la copia del lunes siguiente lo refleja.',
      },
      { tipo: 'h2', texto: 'Qué hacer' },
      {
        tipo: 'lista',
        items: [
          'Mira la fecha de actualización en el mapa y compárala con el Excel oficial.',
          'Confirma horario, teléfono y domicilio con la guardería o con el IMSS antes de trasladarte.',
          'Para el trámite, usa la ficha IMSS-01-006 y los teléfonos que publica el Instituto: 800 623 2323 y, para guarderías, 800 900 1300.',
        ],
      },
      { tipo: 'h2', texto: 'Por qué no se edita aquí' },
      {
        tipo: 'p',
        texto:
          'Cambiar un dato a mano rompería la relación con la fuente pública. El mapa no verifica cada unidad en campo. Por eso la ficha repite la fila y la fecha, y el aviso legal dice que el dato puede estar desactualizado.',
      },
    ],
    referencias: [directorioExcel, tramiteInscripcion, paginaGuarderias],
  },
]

export function buscarGuia(slug: string): Guia | undefined {
  return guias.find((item) => item.slug === slug)
}
