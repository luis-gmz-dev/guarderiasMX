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
  },
]

export function buscarGuia(slug: string): Guia | undefined {
  return guias.find((item) => item.slug === slug)
}
