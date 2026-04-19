import { Injectable } from '@angular/core';

export interface HolidayDescription {
  name: string;
  description: string;
  origin: string;
  traditions: string;
}

/**
 * Servicio que proporciona descripciones detalladas de los festivos españoles.
 * Estas descripciones aportan contenido de valor para SEO y para los usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class HolidayDescriptionsService {

  private readonly descriptions: Record<string, HolidayDescription> = {
    // ── Festivos Nacionales ──────────────────────────────────────
    'año nuevo': {
      name: 'Año Nuevo',
      description: 'El 1 de enero marca el inicio del nuevo año en el calendario gregoriano. Es un festivo nacional en España y en la mayoría de países del mundo.',
      origin: 'La celebración del Año Nuevo tiene raíces en las antiguas civilizaciones mesopotámicas. En España, la tradición más icónica es la de tomar las doce uvas de la suerte con las campanadas de medianoche.',
      traditions: 'Las doce uvas se comen una por cada campanada del reloj de la Puerta del Sol de Madrid. También es tradición llevar ropa interior roja para atraer la buena suerte y brindar con cava o champán.',
    },
    'epifanía del señor': {
      name: 'Epifanía del Señor (Día de Reyes)',
      description: 'El 6 de enero se celebra la llegada de los Reyes Magos de Oriente (Melchor, Gaspar y Baltasar) al portal de Belén para adorar al Niño Jesús y entregarle sus regalos: oro, incienso y mirra.',
      origin: 'La festividad tiene su origen en la tradición cristiana que conmemora la manifestación de Jesús a los pueblos gentiles, representados por los Magos de Oriente. En España se celebra desde la Edad Media.',
      traditions: 'La víspera, el 5 de enero, se celebran las Cabalgatas de Reyes en todas las ciudades y pueblos de España. Los niños reciben regalos y se comparte el tradicional Roscón de Reyes, un dulce en forma de corona adornado con frutas escarchadas.',
    },
    'reyes': {
      name: 'Día de Reyes',
      description: 'El 6 de enero se celebra la llegada de los Reyes Magos de Oriente (Melchor, Gaspar y Baltasar) al portal de Belén para adorar al Niño Jesús.',
      origin: 'Festividad cristiana que conmemora la Epifanía, la manifestación de Jesús a los pueblos gentiles. En España es una de las fechas más importantes del calendario navideño.',
      traditions: 'Las Cabalgatas de Reyes recorren las calles la víspera. Los niños reciben sus regalos y las familias comparten el Roscón de Reyes.',
    },
    'viernes santo': {
      name: 'Viernes Santo',
      description: 'El Viernes Santo conmemora la crucifixión y muerte de Jesucristo en el Calvario. Es uno de los días más solemnes del calendario litúrgico cristiano y un festivo nacional en España.',
      origin: 'Forma parte del Triduo Pascual y se celebra el viernes anterior al Domingo de Resurrección. La fecha varía cada año según el calendario lunar, cayendo entre el 20 de marzo y el 23 de abril.',
      traditions: 'En toda España se celebran procesiones de Semana Santa, destacando las de Sevilla, Málaga, Valladolid y Zamora. Las cofradías y hermandades sacan sus pasos (imágenes religiosas sobre andas) por las calles. Es tradición comer potaje de vigilia, torrijas y no consumir carne.',
    },
    'fiesta del trabajo': {
      name: 'Fiesta del Trabajo',
      description: 'El 1 de mayo se celebra el Día Internacional de los Trabajadores, una jornada reivindicativa de los derechos laborales y la justicia social.',
      origin: 'La fecha conmemora los sucesos de Chicago de 1886, cuando trabajadores estadounidenses iniciaron una huelga general para reivindicar la jornada laboral de ocho horas. Fue declarado festivo internacional en 1889.',
      traditions: 'Los sindicatos organizan manifestaciones y actos reivindicativos en las principales ciudades. En muchos pueblos coincide con celebraciones primaverales como romerías y fiestas campestres.',
    },
    'día del trabajo': {
      name: 'Día del Trabajo',
      description: 'El 1 de mayo se celebra el Día Internacional de los Trabajadores, una jornada reivindicativa de los derechos laborales.',
      origin: 'Conmemora la huelga general de Chicago de 1886 por la jornada de ocho horas.',
      traditions: 'Manifestaciones sindicales, actos reivindicativos y celebraciones primaverales.',
    },
    'asunción de la virgen': {
      name: 'Asunción de la Virgen',
      description: 'El 15 de agosto se celebra la Asunción de la Virgen María al cielo en cuerpo y alma. Es uno de los festivos nacionales más importantes del verano en España.',
      origin: 'El dogma de la Asunción fue proclamado por el Papa Pío XII en 1950, aunque la festividad se celebraba desde siglos antes. En España es festivo nacional ininterrumpidamente desde la Edad Media.',
      traditions: 'En numerosos pueblos y ciudades se celebran fiestas patronales en honor a la Virgen. Destacan las fiestas de la Mare de Déu en Elche con el Misteri d\'Elx (Patrimonio de la Humanidad), las procesiones marítimas en localidades costeras y verbenas populares.',
    },
    'fiesta nacional de españa': {
      name: 'Fiesta Nacional de España',
      description: 'El 12 de octubre es la Fiesta Nacional de España, también conocido como Día de la Hispanidad. Conmemora la llegada de Cristóbal Colón a América en 1492.',
      origin: 'La fecha fue establecida como fiesta nacional en 1987 por la Ley 18/1987. Anteriormente se conocía como Día de la Raza o Día de la Hispanidad. Coincide con la festividad de la Virgen del Pilar, patrona de Zaragoza y de la Hispanidad.',
      traditions: 'En Madrid se celebra un desfile militar presidido por el Rey de España y la Familia Real. En Zaragoza se celebran las Fiestas del Pilar con las tradicionales ofrendas de flores a la Virgen del Pilar.',
    },
    'día de la hispanidad': {
      name: 'Día de la Hispanidad',
      description: 'El 12 de octubre es la Fiesta Nacional de España, conmemorando el descubrimiento de América en 1492.',
      origin: 'Establecida como fiesta nacional en 1987. Coincide con la festividad de la Virgen del Pilar.',
      traditions: 'Desfile militar en Madrid y Fiestas del Pilar en Zaragoza con ofrendas de flores.',
    },
    'todos los santos': {
      name: 'Día de Todos los Santos',
      description: 'El 1 de noviembre se celebra el Día de Todos los Santos, una festividad cristiana que honra a todos los santos conocidos y desconocidos. Es una jornada de recuerdo y homenaje a los difuntos.',
      origin: 'La festividad fue establecida por el Papa Gregorio IV en el año 835. En España es festivo desde tiempo inmemorial y está profundamente arraigada la tradición de visitar los cementerios para honrar a los seres queridos fallecidos.',
      traditions: 'Las familias visitan los cementerios para limpiar y adornar las tumbas con flores, especialmente crisantemos. Se degusta la gastronomía típica de la fecha como los huesos de santo, buñuelos de viento y las castañas asadas. En algunas regiones se celebra la castañada.',
    },
    'día de la constitución': {
      name: 'Día de la Constitución Española',
      description: 'El 6 de diciembre se conmemora el referéndum de 1978 en el que el pueblo español aprobó la Constitución vigente, que establece España como un Estado social y democrático de Derecho.',
      origin: 'La Constitución Española fue ratificada en referéndum el 6 de diciembre de 1978, con un 87,78% de votos a favor. Es la norma suprema del ordenamiento jurídico español y establece los derechos y libertades fundamentales de los ciudadanos.',
      traditions: 'El Congreso de los Diputados abre sus puertas al público en jornada de puertas abiertas. Se celebran actos institucionales en todo el país. Junto con la Inmaculada Concepción (8 de diciembre), forma el popular "puente de la Constitución", uno de los más esperados del año.',
    },
    'constitución española': {
      name: 'Día de la Constitución',
      description: 'El 6 de diciembre se conmemora la ratificación de la Constitución Española de 1978.',
      origin: 'Aprobada en referéndum el 6 de diciembre de 1978 con un 87,78% de votos favorables.',
      traditions: 'Puertas abiertas en el Congreso, actos institucionales y el famoso "puente de diciembre".',
    },
    'inmaculada concepción': {
      name: 'Inmaculada Concepción',
      description: 'El 8 de diciembre se celebra la festividad de la Inmaculada Concepción de la Virgen María, dogma de la fe católica que sostiene que María fue concebida sin pecado original.',
      origin: 'El dogma fue proclamado por el Papa Pío IX en 1854 mediante la bula Ineffabilis Deus. España es uno de los países donde esta festividad tiene mayor arraigo, siendo la Inmaculada patrona del Arma de Infantería del Ejército español.',
      traditions: 'En Sevilla se celebra la tradicional Danza de los Seises en la Catedral. En muchas ciudades se instalan los belenes y se inician los mercadillos navideños. Es tradición que muchas familias monten el árbol de Navidad en esta fecha.',
    },
    'natividad del señor': {
      name: 'Navidad',
      description: 'El 25 de diciembre se celebra la Navidad, la festividad cristiana que conmemora el nacimiento de Jesucristo en Belén. Es una de las fechas más importantes del calendario.',
      origin: 'La fecha del 25 de diciembre fue establecida en el siglo IV por la Iglesia Católica. En España, las celebraciones navideñas se extienden desde la Nochebuena (24 de diciembre) hasta el Día de Reyes (6 de enero).',
      traditions: 'La Nochebuena se celebra con una cena familiar donde se sirven platos como el cordero asado, mariscos, turrones y polvorones. Se cantan villancicos y muchas familias asisten a la Misa del Gallo. El día de Navidad continúa con reuniones familiares y comidas tradicionales.',
    },
    'navidad': {
      name: 'Navidad',
      description: 'El 25 de diciembre se celebra el nacimiento de Jesucristo. Es una de las festividades más importantes del año en España.',
      origin: 'Celebración cristiana establecida en el siglo IV. Las fiestas navideñas en España se extienden hasta el 6 de enero.',
      traditions: 'Cena de Nochebuena en familia, turrones, polvorones, villancicos y Misa del Gallo.',
    },
    'jueves santo': {
      name: 'Jueves Santo',
      description: 'El Jueves Santo conmemora la Última Cena de Jesucristo con sus apóstoles, donde instituyó la Eucaristía y el sacerdocio. Es uno de los días más importantes de la Semana Santa.',
      origin: 'Forma parte del Triduo Pascual y se celebra el jueves anterior al Domingo de Resurrección. Su fecha varía según el calendario lunar.',
      traditions: 'En toda España salen procesiones solemnes, muchas de ellas nocturnas. Destaca el silencio y recogimiento de las procesiones. En algunas localidades se celebra el Lavatorio de pies y la Visita a los Monumentos.',
    },
    'lunes de pascua': {
      name: 'Lunes de Pascua',
      description: 'El Lunes de Pascua, también conocido como Lunes de Pascua Florida, se celebra el día después del Domingo de Resurrección. Marca el final de la Semana Santa.',
      origin: 'Festividad cristiana que celebra la Resurrección de Cristo. Es festivo en varias comunidades autónomas como Cataluña, Comunidad Valenciana, Navarra, País Vasco y Baleares.',
      traditions: 'En Cataluña es tradición comer la "Mona de Pascua", un pastel de chocolate elaborado artísticamente. En la Comunidad Valenciana se celebra la "Mona de Pascua" con reuniones familiares y meriendas al aire libre.',
    },
    'lunes de pascua granada': {
      name: 'Lunes de Pascua (Granada)',
      description: 'En Granada, el Lunes de Pascua se celebra con especial tradición y devoción.',
      origin: 'Festividad regional que marca el final de la Semana Santa.',
      traditions: 'Reuniones familiares al aire libre y gastronomía pascual típica granadina.',
    },

    // ── Festivos Autonómicos frecuentes ──────────────────────────
    'día de andalucía': {
      name: 'Día de Andalucía',
      description: 'El 28 de febrero se celebra el Día de Andalucía, conmemorando el referéndum de 1980 en el que los andaluces votaron a favor del acceso a la autonomía plena por la vía del artículo 151 de la Constitución.',
      origin: 'El referéndum del 28 de febrero de 1980 fue un hito histórico en el que Andalucía reivindicó su derecho a la autonomía en igualdad de condiciones con las "nacionalidades históricas". El Estatuto de Autonomía fue aprobado en 1981.',
      traditions: 'Se celebran actos institucionales, izada de la bandera verde y blanca andaluza, actividades culturales y festivales. Los colegios celebran actividades especiales sobre la cultura andaluza.',
    },
    'día de aragón': {
      name: 'Día de Aragón',
      description: 'El 23 de abril se celebra el Día de Aragón, coincidiendo con la festividad de San Jorge, patrón de la comunidad.',
      origin: 'La fecha conmemora a San Jorge, patrón de Aragón desde la Edad Media, vinculado a la leyenda de la conquista de Huesca.',
      traditions: 'Se celebran actos institucionales y se entrega la Medalla de Aragón. Coincide con el Día del Libro.',
    },
    'día de canarias': {
      name: 'Día de Canarias',
      description: 'El 30 de mayo se celebra el Día de Canarias, conmemorando la primera sesión del Parlamento de Canarias en 1983.',
      origin: 'La fecha recuerda la constitución del primer Parlamento autonómico canario.',
      traditions: 'Actividades culturales, festival folclórico, deportes autóctonos como la lucha canaria y gastronomía típica.',
    },
    'día de cantabria': {
      name: 'Día de las Instituciones de Cantabria',
      description: 'El segundo domingo de agosto se celebra el Día de las Instituciones de Cantabria.',
      origin: 'Conmemora la creación de las instituciones de autogobierno de Cantabria.',
      traditions: 'Actos institucionales y actividades culturales y festivas en toda la comunidad.',
    },
    'día de castilla y león': {
      name: 'Día de Castilla y León',
      description: 'El 23 de abril se celebra el Día de Castilla y León, conmemorando la Batalla de Villalar de 1521.',
      origin: 'Recuerda la derrota de los comuneros en Villalar, que lucharon por las libertades de Castilla frente al poder imperial de Carlos V.',
      traditions: 'Acto institucional en Villalar de los Comuneros (Valladolid) con romería, conciertos y actos culturales.',
    },
    'día de castilla-la mancha': {
      name: 'Día de Castilla-La Mancha',
      description: 'El 31 de mayo se celebra el Día de Castilla-La Mancha, conmemorando la aprobación del Estatuto de Autonomía.',
      origin: 'La fecha recuerda la entrada en vigor del Estatuto de Autonomía de Castilla-La Mancha en 1983.',
      traditions: 'Actos institucionales y actividades culturales en las cinco provincias de la comunidad.',
    },
    'diada nacional de catalunya': {
      name: 'Diada Nacional de Catalunya',
      description: 'El 11 de septiembre se celebra la Diada, el día nacional de Cataluña, conmemorando la caída de Barcelona durante la Guerra de Sucesión en 1714.',
      origin: 'El 11 de septiembre de 1714, las tropas borbónicas tomaron Barcelona tras un largo asedio, poniendo fin a las instituciones propias de Cataluña. La fecha se convirtió en símbolo de identidad nacional.',
      traditions: 'Se realizan ofrendas florales ante el monumento de Rafael Casanova. Se celebran concentraciones, actos culturales y manifestaciones. Es tradición que los balcones se engalanen con la senyera.',
    },
    'la diada': {
      name: 'Diada de Catalunya',
      description: 'El 11 de septiembre es el Día Nacional de Cataluña, recordando la caída de Barcelona en 1714.',
      origin: 'Conmemora la derrota de las tropas catalanas ante el ejército borbónico durante la Guerra de Sucesión.',
      traditions: 'Ofrendas florales, actos culturales, manifestaciones y senyeras en los balcones.',
    },
    'día de la comunidad valenciana': {
      name: 'Día de la Comunidad Valenciana',
      description: 'El 9 de octubre se celebra el Día de la Comunidad Valenciana, conmemorando la entrada de Jaime I en la ciudad de Valencia en 1238.',
      origin: 'La fecha recuerda la conquista cristiana de Valencia por el rey Jaime I de Aragón, tras la capitulación del rey musulmán Zayyán.',
      traditions: 'Se celebra la "Procesión Cívica" por el centro histórico de Valencia. Se dispara la "mascletà" y hay eventos culturales. Es tradición regalar mocadorà (pañuelo con dulces).',
    },
    'día de extremadura': {
      name: 'Día de Extremadura',
      description: 'El 8 de septiembre se celebra el Día de Extremadura, coincidiendo con la festividad de la Virgen de Guadalupe, patrona de la comunidad.',
      origin: 'La Virgen de Guadalupe, cuyo santuario se encuentra en Guadalupe (Cáceres), es patrona de Extremadura. La devoción tiene siglos de antigüedad.',
      traditions: 'Actos religiosos en el Real Monasterio de Guadalupe, actos institucionales y celebraciones por toda la comunidad.',
    },
    'día de las letras gallegas': {
      name: 'Día de las Letras Gallegas',
      description: 'El 17 de mayo se celebra el Día de las Letras Gallegas, homenajeando cada año a una personalidad destacada de la literatura en lengua gallega.',
      origin: 'Fue instaurado en 1963 por la Real Academia Gallega, coincidiendo con el centenario de la publicación de "Cantares Gallegos" de Rosalía de Castro.',
      traditions: 'Actos literarios, publicaciones especiales, lectura pública de obras del homenajeado y actividades culturales en toda Galicia.',
    },
    'día de galicia': {
      name: 'Día Nacional de Galicia',
      description: 'El 25 de julio se celebra el Día Nacional de Galicia, coincidiendo con la festividad del Apóstol Santiago.',
      origin: 'Santiago el Mayor es el patrón de Galicia y de España. La tradición sitúa su sepulcro en Santiago de Compostela.',
      traditions: 'Actos institucionales, fuegos artificiales y ofrenda al Apóstol en la Catedral de Santiago. Es tradición la quema del "Apóstol" (fuegos pirotécnicos).',
    },
    'santiago apóstol': {
      name: 'Santiago Apóstol',
      description: 'El 25 de julio se celebra la festividad de Santiago Apóstol, patrón de España. Santiago el Mayor fue uno de los doce apóstoles de Jesús.',
      origin: 'Según la tradición, los restos del apóstol Santiago fueron trasladados a Galicia y descubiertos en el siglo IX. La Catedral de Santiago de Compostela se convirtió en uno de los principales centros de peregrinación de la cristiandad.',
      traditions: 'El Camino de Santiago es la principal manifestación de devoción al Apóstol. En los Años Santos (cuando el 25 de julio cae en domingo, como en 2027) se celebra el Año Jacobeo con especral solemnidad.',
    },
    'día de la rioja': {
      name: 'Día de La Rioja',
      description: 'El 9 de junio se celebra el Día de La Rioja, conmemorando la aprobación del Estatuto de Autonomía.',
      origin: 'La fecha recuerda la aprobación del Estatuto de Autonomía de La Rioja por las Cortes Generales en 1982.',
      traditions: 'Actos institucionales, actividades culturales y festividades populares en Logroño y toda la comunidad.',
    },
    'día de la comunidad de madrid': {
      name: 'Día de la Comunidad de Madrid',
      description: 'El 2 de mayo se celebra el Día de la Comunidad de Madrid, conmemorando el levantamiento del pueblo madrileño contra las tropas napoleónicas en 1808.',
      origin: 'El 2 de mayo de 1808, el pueblo de Madrid se levantó espontáneamente contra la ocupación francesa, dando inicio a la Guerra de la Independencia Española. Héroes como los capitanes Daoíz y Velarde son recordados por su valentía.',
      traditions: 'Se celebran actos institucionales en la Real Casa de Correos de la Puerta del Sol. Se entregan los premios de la Comunidad de Madrid y se realizan conciertos y actividades culturales gratuitas.',
    },
    'día de la región de murcia': {
      name: 'Día de la Región de Murcia',
      description: 'El 9 de junio se celebra el Día de la Región de Murcia.',
      origin: 'Conmemora la aprobación del Estatuto de Autonomía de la Región de Murcia.',
      traditions: 'Actos institucionales, Bando de la Huerta y festividades populares.',
    },
    'día de navarra': {
      name: 'Día de Navarra',
      description: 'El 3 de diciembre se celebra el Día de Navarra, en honor a San Francisco Javier, patrón de la comunidad.',
      origin: 'Francisco de Javier nació en Navarra en 1506 y fue uno de los fundadores de la Compañía de Jesús. Es patrono de las misiones.',
      traditions: 'Actos institucionales y la celebración de la "Javierada", una peregrinación al Castillo de Javier.',
    },
    'día del país vasco': {
      name: 'Día del País Vasco (Aberri Eguna)',
      description: 'El Domingo de Resurrección se celebra el Aberri Eguna (Día de la Patria Vasca).',
      origin: 'Fue establecido por Sabino Arana, fundador del PNV, como día de la patria vasca. Se celebra el Domingo de Pascua.',
      traditions: 'Actos culturales, ikurriñas en los balcones y manifestaciones festivas en las tres capitales vascas.',
    },
    'día de las islas baleares': {
      name: 'Día de las Islas Baleares',
      description: 'El 1 de marzo se celebra el Día de las Islas Baleares, conmemorando la entrada en vigor del Estatuto de Autonomía.',
      origin: 'La fecha recuerda la aprobación del Estatuto de Autonomía de las Islas Baleares en 1983.',
      traditions: 'Actos institucionales, actividades culturales y festividades en Mallorca, Menorca, Ibiza y Formentera.',
    },
    'día de asturias': {
      name: 'Día de Asturias',
      description: 'El 8 de septiembre se celebra el Día de Asturias, coincidiendo con la festividad de la Virgen de Covadonga, patrona del Principado.',
      origin: 'La Virgen de Covadonga está vinculada al inicio de la Reconquista en 722 con la batalla de Covadonga, donde Don Pelayo venció a las tropas musulmanas.',
      traditions: 'Romería a la Basílica de Covadonga, actos institucionales y festividades populares por todo el Principado.',
    },
    'san josé': {
      name: 'San José',
      description: 'El 19 de marzo se celebra la festividad de San José, padre putativo de Jesús. Es festivo en varias comunidades autónomas y coincide con el Día del Padre en España.',
      origin: 'San José es el patrón de los trabajadores y de la Iglesia Universal. En España, esta festividad tiene especial relevancia en la Comunidad Valenciana por las Fallas.',
      traditions: 'En Valencia se celebran las Fallas, declaradas Patrimonio Inmaterial de la Humanidad por la UNESCO. La "Cremà" (quema de las fallas) tiene lugar la noche del 19 de marzo. Es también el Día del Padre.',
    },
    'san isidro labrador': {
      name: 'San Isidro Labrador',
      description: 'El 15 de mayo se celebra la festividad de San Isidro Labrador, patrón de Madrid y de los agricultores.',
      origin: 'San Isidro Mozárabe vivió en Madrid entre los siglos XI y XII. Fue canonizado en 1622. Es conocido por sus milagros relacionados con el agua y la agricultura.',
      traditions: 'En Madrid se celebran las Fiestas de San Isidro con verbenas, conciertos, la romería de la Pradera de San Isidro, corridas de toros en Las Ventas y gastronomía típica como las rosquillas (tontas, listas y de Santa Clara).',
    },
    'san isidro': {
      name: 'San Isidro',
      description: 'El 15 de mayo Madrid celebra a su patrón, San Isidro Labrador.',
      origin: 'San Isidro fue un labrador madrileño del siglo XII, canonizado en 1622.',
      traditions: 'Verbenas, romería en la Pradera de San Isidro y las famosas rosquillas.',
    },
    'corpus christi': {
      name: 'Corpus Christi',
      description: 'La festividad del Corpus Christi celebra la presencia real de Jesucristo en la Eucaristía. Se celebra 60 días después del Domingo de Resurrección.',
      origin: 'Fue instaurada en 1264 por el Papa Urbano IV. En España tiene una tradición centenaria con especial relevancia en Toledo, Granada y Sevilla.',
      traditions: 'Procesiones solemnes con la custodia por calles engalanadas con alfombras de flores. En Toledo es especialmente espectacular, con las calles cubiertas de toldos y tapices.',
    },
    'san juan': {
      name: 'San Juan',
      description: 'La noche del 23 al 24 de junio se celebra la festividad de San Juan, coincidiendo con el solsticio de verano. Es festivo en varias comunidades.',
      origin: 'Combina la tradición cristiana del nacimiento de San Juan Bautista con las antiguas celebraciones paganas del solsticio de verano.',
      traditions: 'Las hogueras de San Juan iluminan las playas de toda España, especialmente en Alicante (Hogueras de San Juan, declaradas Fiesta de Interés Turístico Internacional). Es tradición saltar las hogueras y bañarse en el mar a medianoche.',
    },

    // ── Otros festivos comunes ───────────────────────────────────
    'lunes siguiente a la epifanía del señor': {
      name: 'Traslado de la Epifanía',
      description: 'Cuando la Epifanía del Señor (6 de enero) cae en un determinado día, el festivo puede trasladarse al lunes siguiente.',
      origin: 'El traslado de festivos al lunes es una práctica contemplada en la legislación española para evitar la pérdida de días festivos cuando caen en fin de semana.',
      traditions: 'Se mantienen las mismas tradiciones del día de Reyes: Roscón de Reyes y reuniones familiares.',
    },
    'san esteban': {
      name: 'San Esteban',
      description: 'El 26 de diciembre se celebra la festividad de San Esteban, primer mártir cristiano. Es festivo en Cataluña.',
      origin: 'San Esteban fue el primer diácono y protomártir de la Iglesia cristiana, lapidado por predicar el Evangelio.',
      traditions: 'En Cataluña es tradición comer los "canelones de San Esteban", elaborados con las sobras de la escudella i carn d\'olla del día de Navidad.',
    },
    'lunes de Carnestoltes': {
      name: 'Lunes de Carnaval',
      description: 'El Lunes de Carnaval se celebra en algunas comunidades como preludio a la festividad.',
      origin: 'El Carnaval tiene orígenes paganos y celebra la alegría antes del periodo de Cuaresma cristiano.',
      traditions: 'Disfraces, comparsas, murgas y pasacalles por las calles. Destaca el Carnaval de Santa Cruz de Tenerife y el de Cádiz.',
    },
    'martes de carnaval': {
      name: 'Martes de Carnaval',
      description: 'El Martes de Carnaval es el último día de celebración antes del Miércoles de Ceniza y el inicio de la Cuaresma.',
      origin: 'Tradición previa a la Cuaresma con raíces en festividades paganas romanas como las Saturnales.',
      traditions: 'Desfiles de disfraces, concursos de murgas y chirigotas, y el entierro de la sardina.',
    },

    // ── Festivos Autonómicos y Específicos 2026 ──────────────────
    'lunes siguiente al día de las islas baleares': {
      name: 'Día de las Islas Baleares (Traslado)',
      description: 'Traslado del festivo oficial de las Islas Baleares al lunes 2 de marzo en el año 2026.',
      origin: 'El 1 de marzo conmemora la fecha de entrada en vigor del Estatuto de Autonomía de las Islas Baleares de 1983.',
      traditions: 'Actos institucionales, ferias de artesanía y muestras gastronómicas en las cuatro islas del archipiélago.',
    },
    'eid fitr': {
      name: 'Eid Fitr (Final del Ayuno)',
      description: 'Festividad islámica que marca el fin del mes sagrado del Ramadán. Es festivo oficial en las ciudades autónomas de Ceuta y Melilla.',
      origin: 'Establecida por el profeta Mahoma, es una jornada de alegría y agradecimiento tras el sacrificio del ayuno.',
      traditions: 'Rezo comunitario temprano en la mañana (Musalla), visitas familiares, estreno de ropa nueva y entrega de dulces y regalos.',
    },
    'fiesta del sacrificio': {
      name: 'Eid al-Adha (Fiesta del Sacrificio)',
      description: 'La festividad más importante del calendario islámico, que conmemora la voluntad de Abraham de sacrificar a su hijo por obediencia a Dios.',
      origin: 'Festividad de gran arraigo en Ceuta y Melilla, integrada en el calendario laboral oficial.',
      traditions: 'Sacrificio ritual de un cordero, reparto de la carne entre familiares y personas necesitadas, y grandes banquetes familiares.',
    },
    'eidul adha': {
      name: 'Eidul Adha',
      description: 'Festividad del Sacrificio mayor en el Islam, celebrada oficialmente en Ceuta y Melilla.',
      origin: 'Conmemora la devoción de Abraham a Dios. Es una fecha de profunda espiritualidad y comunidad.',
      traditions: 'Celebraciones religiosas, banquetes tradicionales y solidaridad con los más desfavorecidos.',
    },
    'nuestra señora de áfrica': {
      name: 'Nuestra Señora de África',
      description: 'Festividad de la patrona de Ceuta, celebrada el 5 de agosto.',
      origin: 'La imagen fue enviada a Ceuta por el Infante Don Enrique en 1421, convirtiéndose en el símbolo protector de la ciudad.',
      traditions: 'Ofrenda de flores, procesión solemne por las calles de la ciudad autónoma y actos religiosos en el Santuario de África.',
    },
    'día de ceuta': {
      name: 'Día de Ceuta',
      description: 'El 2 de septiembre se celebra la identidad y autonomía de la ciudad de Ceuta.',
      origin: 'Conmemora la llegada de Pedro de Meneses, primer gobernador portugués de la ciudad en 1415.',
      traditions: 'Actos institucionales, entrega de la Medalla de la Autonomía y eventos culturales.',
    },
    'la bien aparecida': {
      name: 'Nuestra Señora de la Bien Aparecida',
      description: 'Patrona de Cantabria, cuya festividad se celebra el 15 de septiembre.',
      origin: 'La virgen fue encontrada en el siglo XVII en el santuario de Hoz de Marrón.',
      traditions: 'Romería al Santuario de la Bien Aparecida, actos religiosos y festejos tradicionales cántabros.',
    },
    'lunes siguiente a todos los santos': {
      name: 'Día de Todos los Santos (Traslado)',
      description: 'Traslado del festivo nacional del 1 de noviembre al lunes 2 de noviembre en varias comunidades autónomas en 2026.',
      origin: 'Práctica establecida para asegurar el descanso laboral cuando el festivo nacional cae en domingo.',
      traditions: 'Visita a los cementerios, ofrendas florales y consumo de dulces típicos (huesos de santo).',
    },
    'lunes siguiente a la constitución': {
      name: 'Día de la Constitución (Traslado)',
      description: 'Traslado del festivo nacional del 6 de diciembre al lunes 7 de diciembre en la mayoría de comunidades autónomas en 2026.',
      origin: 'Genera uno de los puentes más largos y esperados del año (Puente de la Inmaculada).',
      traditions: 'Viajes, turismo nacional, encendido de luces de Navidad y compras navideñas.',
    },
    'san fermín': {
      name: 'San Fermín',
      description: 'El 7 de julio se celebra San Fermín, la fiesta más conocida internacionalmente de Pamplona y de toda Navarra.',
      origin: 'San Fermín fue un misionero cristiano, primer obispo de Amiens y patrón de las diócesis de Pamplona y Tudela.',
      traditions: 'El Chupinazo marca el inicio de las fiestas el 6 de julio. Los Encierros (carreras delante de los toros por las calles) son el evento más famoso, atrayendo a miles de personas de todo el mundo.',
    },
    'sant jordi': {
      name: 'Sant Jordi (San Jorge)',
      description: 'El 23 de abril se celebra Sant Jordi, patrón de Cataluña. Es una de las jornadas culturales más bellas y populares de la región.',
      origin: 'La leyenda cuenta que el caballero Jorge salvó a una princesa de un dragón, naciendo un rosal de la sangre de la bestia.',
      traditions: 'Es tradición regalar un libro y una rosa a los seres queridos. Las calles se llenan de paradas de libros y flores, convirtiéndose en una gran fiesta de la cultura y el amor.',
    },
    'día de la almudena': {
      name: 'Día de la Almudena',
      description: 'El 9 de noviembre Madrid celebra la festividad de su patrona, la Virgen de la Almudena.',
      origin: 'La virgen fue encontrada en un nicho de la muralla (al-mudayna significa ciudadela en árabe) tras la reconquista de Madrid.',
      traditions: 'Ofrenda floral y procesión de la Virgen. Es costumbre degustar la "Corona de la Almudena", un dulce tipo roscón pero sin fruta escarchada.',
    },
    'santo tomás': {
      name: 'Santo Tomás',
      description: 'El 21 de diciembre se celebra Santo Tomás en San Sebastián y Bilbao, marcando el inicio de la Navidad.',
      origin: 'Tiene un origen rural, cuando los baserritarras (labradores) bajaban a la ciudad a pagar sus rentas y vender sus productos.',
      traditions: 'Mercadillos tradicionales donde el producto estrella es la "txistorra" envuelta en "talo" (torta de maíz), acompañada de sidra.',
    },
    'san sebastián': {
      name: 'San Sebastián',
      description: 'El 20 de enero se celebra la festividad de San Sebastián, con especial relevancia en la ciudad de San Sebastián con su famosa Tamborrada.',
      origin: 'Homenaje al santo mártir que da nombre a la ciudad. La Tamborrada tiene un origen vinculado a la ocupación napoleónica.',
      traditions: 'La Tamborrada recorre las calles de San Sebastián durante 24 horas ininterrumpidas al ritmo de las marchas de Sarriegui.',
    },
  };

  /**
   * Busca la descripción de un festivo por su nombre.
   * Usa coincidencia parcial normalizada para encontrar el festivo.
   */
  getDescription(festivoName: string): HolidayDescription | null {
    const normalizedSearch = this.normalize(festivoName);

    // Búsqueda por coincidencia: normalizamos tanto la clave como el término de búsqueda
    for (const [key, value] of Object.entries(this.descriptions)) {
      const normalizedKey = this.normalize(key);
      if (normalizedSearch.includes(normalizedKey) || normalizedKey.includes(normalizedSearch)) {
        return value;
      }
    }

    return null;
  }

  /**
   * Verifica si hay una descripción disponible para el festivo dado.
   */
  hasDescription(festivoName: string): boolean {
    return this.getDescription(festivoName) !== null;
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // Separa los acentos de las letras
      .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
      .replace(/ñ/g, 'n') // Asegura que la ñ se trate como n
      .trim();
  }
}
