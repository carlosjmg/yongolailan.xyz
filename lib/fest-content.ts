// ARTeration Fest: starter content (English + Spanish) and interface strings.
// Artist bios come from the festival proposal; Spanish versions are translations
// (Yongolailan's and Luis McDougal's are the festival's own Spanish texts).
// Everything here can be edited afterwards in the admin.

export type Lang = "en" | "es";

export const LANGS: Lang[] = ["en", "es"];

export interface SeedArtist {
  name: string;
  role: string;
  roleEs: string;
  bio: string;
  bioEs: string;
  image: string | null;
  instagramUrl?: string;
}

const A = "/images/arteration/artists/";

// Poster order first, then the artists named in the proposal.
export const SEED_ARTISTS: SeedArtist[] = [
  { name: "Misty", role: "", roleEs: "", bio: "", bioEs: "", image: null },
  {
    name: "Faustino",
    role: "Singer-songwriter · New York",
    roleEs: "Cantautor · Nueva York",
    bio: "Faustino is a Dominican singer-songwriter based in New York who transforms his journey into song. His music is a spiritual journey, a constant discovery of feeling. Inspired by nostalgia, love, grief, and the celebration of everyday life, Faustino writes from experience with a raw and luminous sensitivity: a Caribbean and deeply human style. He lived in the Dominican Republic until the age of 24, where he developed his career as an audiovisual director. He decided to move to New York to begin a new expedition inward, accompanied by a guitar, and to devote himself to singing to the sun.",
    bioEs:
      "Faustino es un cantautor dominicano radicado en Nueva York que transforma su recorrido en canciones. Su música es un viaje espiritual, un descubrimiento constante del sentir. Inspirado por la nostalgia, el amor, el duelo y la celebración de lo cotidiano, escribe desde la experiencia con una sensibilidad cruda y luminosa: un estilo caribeño y profundamente humano. Vivió en República Dominicana hasta los 24 años, donde desarrolló su carrera como director audiovisual. Se mudó a Nueva York para comenzar una nueva expedición hacia adentro, acompañado de una guitarra, y para dedicarse a cantarle al sol.",
    image: null,
  },
  {
    name: "IKKI",
    role: "Artist & producer · New York",
    roleEs: "Artista y productora · Nueva York",
    bio: "IKKI is a New York City–based artist and producer bridging live music with holistic well-being. Her work blends atmospheric sets with Afro-Caribbean roots, creating immersive, groove-driven experiences that invite audiences into spaces of deep listening and transformative dialogue.",
    bioEs:
      "IKKI es una artista y productora radicada en Nueva York que une la música en vivo con el bienestar integral. Su trabajo mezcla sets atmosféricos con raíces afrocaribeñas y crea experiencias inmersivas, llenas de groove, que invitan al público a espacios de escucha profunda y de diálogo transformador.",
    image: null,
  },
  {
    name: "Yongolailan",
    role: "DJ & producer · New York",
    roleEs: "DJ y productor · Nueva York",
    bio: "Yongolailan (Carlos José Martínez) is a multidisciplinary Cuban artist based in New York City, active as a DJ, producer, and live electronic performer. Award-winning and internationally experienced, he blends Afro-diasporic rhythms with contemporary electronic music. He is the founder of the Brooklyn-based record label Caribbean Sea Sound, under which he has produced and collaborated with artists such as Cimafunk, Arema Arega, and Reinier Aldana, among others.",
    bioEs:
      "Yongolailan (Carlos José Martínez) es un artista cubano multidisciplinario radicado en la ciudad de Nueva York, activo como DJ, productor y artista sonoro. Galardonado y con trayectoria internacional, fusiona ritmos afrodiaspóricos con música electrónica contemporánea. Es fundador del sello discográfico Caribbean Sea Sound, con base en Brooklyn, desde donde ha producido y colaborado con numerosos artistas de distintas partes del mundo.",
    image: A + "yongolailan.webp",
  },
  {
    name: "Luis McDougal",
    role: "Guitarist & composer · Brooklyn",
    roleEs: "Guitarrista y compositor · Brooklyn",
    bio: "Luis McDougal is a Dominican-American guitarist and composer based in Brooklyn. He has performed with renowned artists including Samuel Torres, Max Light, Tony Arnold, Rafael Solano, and Aisha Syed, appearing on stages such as Carnegie Hall, the MIJA Jazz Festival, and Festival Internacional de Salterio in Mexico. His recent projects include his debut album as a bandleader, JoinAnOrg, and a European tour in January–February 2026 as part of Yubo Fernández's new art exhibition at FITUR. In 2024, Luis became an endorsed artist for Nock's Guitars, a boutique guitar builder based in Morocco. He is also president of the Institute for Music Evolution (I.M.E.), a nonprofit foundation dedicated to challenging musical traditions to foster critical thinking, community unity, and social transformation through educational programs and public concerts.",
    bioEs:
      "Luis McDougal es un guitarrista y compositor dominico-americano radicado en Brooklyn. Con una destacada trayectoria en escenarios como el Carnegie Hall y el MIJA Jazz Festival, Luis celebra este año el lanzamiento de su álbum debut, JoinAnOrg. Paralelamente a su carrera artística, preside el Institute for Music Evolution (I.M.E.), una fundación sin fines de lucro dedicada a desafiar las tradiciones musicales para fomentar el pensamiento crítico, la unión comunitaria y la transformación social a través de programas educativos y conciertos públicos.",
    image: A + "luis-mcdougal.webp",
  },
  {
    name: "Disco Curandera",
    role: "DJ · Dance floor rituals",
    roleEs: "DJ · Rituales de pista",
    bio: "Disco Curandera weaves together disco, cumbia, salsa, house, and global rhythms to create dance floor rituals rooted in joy, connection, and movement. Inspired by the medicine of music, each set invites people to celebrate their shared humanity through rhythm, collective release, and the universal language of dance.",
    bioEs:
      "Disco Curandera entreteje disco, cumbia, salsa, house y ritmos del mundo para crear rituales de pista de baile basados en la alegría, la conexión y el movimiento. Con la música como medicina, cada set invita a celebrar nuestra humanidad compartida a través del ritmo, la liberación colectiva y el lenguaje universal de la danza.",
    image: null,
  },
  {
    name: "Carlos Manuel Rivera",
    role: "Writer, performer & poet · Bronx",
    roleEs: "Escritor, performer y poeta · Bronx",
    bio: "Carlos Manuel Rivera is a Latino, Puerto Rican writer, performer, and poet. He has authored several books in Spanish, including Bululú: perfume y veneno (Editora Educación Emergente, 2024). Rivera is a professor of world languages and cultures at Bronx Community College and lives in the Bronx, New York.",
    bioEs:
      "Carlos Manuel Rivera es un escritor, performer y poeta latino puertorriqueño. Es autor de varios libros en español, entre ellos Bululú: perfume y veneno (Editora Educación Emergente, 2024). Rivera es profesor de lenguas y culturas del mundo en Bronx Community College y vive en el Bronx, Nueva York.",
    image: null,
  },
  {
    name: "Esteban Vélez",
    role: "Musician · Colombian roots music",
    roleEs: "Músico · Música de raíz colombiana",
    bio: "Esteban Vélez is a Colombian artist from Medellín with a background in classical music studies at Queens College. After graduating, he began exploring popular music in 2012, delving into blues, jazz, bolero, and New York salsa. His musical journey led him to Colombian roots music such as cumbia and gaita folklore. In 2014, he traveled to Mexico and Colombia to further his research project on traditional Pacific and Caribbean music, studying with masters such as Jose Alvarez Jr., Carmelo Torres, Ivan Salcedo, and others. Upon his return to New York in 2018, he joined projects such as the New York City Gaita Club and La Cumbiamba Eneyé, and co-founded the gaita folklore performance collective Púyalo Ahí in 2022.",
    bioEs:
      "Esteban Vélez es un artista colombiano de Medellín con formación en música clásica en Queens College. Tras graduarse, en 2012 comenzó a explorar la música popular, adentrándose en el blues, el jazz, el bolero y la salsa neoyorquina. Su recorrido lo llevó a la música de raíz colombiana, como la cumbia y el folclor de gaitas. En 2014 viajó a México y Colombia para profundizar su proyecto de investigación sobre la música tradicional del Pacífico y el Caribe, estudiando con maestros como Jose Alvarez Jr., Carmelo Torres, Ivan Salcedo y otros. A su regreso a Nueva York en 2018 se integró a proyectos como el New York City Gaita Club y La Cumbiamba Eneyé, y en 2022 cofundó el colectivo de performance de folclor de gaitas Púyalo Ahí.",
    image: A + "esteban-velez.webp",
  },
  {
    name: "Bhietxa",
    role: "Singer-songwriter · Colombia",
    roleEs: "Cantautora · Colombia",
    bio: "Bhietxa is a Colombian singer-songwriter. She began her career in 2016 after winning a grant from the Antioquia Institute of Historical Heritage for composition. In 2018 she released her first album, Bhietxa, which earned her recognition in the Record Production category of Rionegro's program to support artistic and cultural talent. Her music is played on Colombian television, and she is currently finishing her second album.",
    bioEs:
      "Bhietxa es una cantautora colombiana. Comenzó su carrera en 2016 tras ganar una beca de composición del Instituto de Patrimonio Histórico de Antioquia. En 2018 lanzó su primer álbum, titulado Bhietxa, que le valió un reconocimiento en la categoría de Producción Discográfica del programa de apoyo al talento artístico y cultural de Rionegro. Su música suena en la televisión colombiana y actualmente está terminando su segundo álbum.",
    image: A + "bhietxa.webp",
  },
  {
    name: "Chico Raro",
    role: "Multidisciplinary artist · New York",
    roleEs: "Artista multidisciplinario · Nueva York",
    bio: "Chico Raro is a vibrant queer multidisciplinary artist, singer, violinist, and actor based in New York City, recognized for their activism and for founding El Armario NYC (The Wardrobe), a performance lab and community space for Latinx queer artists facing threats to their rights, creating a crucial open space for creation and performance in challenging times.",
    bioEs:
      "Chico Raro es un vibrante artista queer multidisciplinario, cantante, violinista y actor radicado en Nueva York, reconocido por su activismo y por fundar El Armario NYC, un laboratorio de performance y espacio comunitario para artistas queer latinxs cuyos derechos están amenazados, que crea un espacio abierto fundamental para la creación y la performance en tiempos difíciles.",
    image: A + "chico-raro.webp",
  },
  {
    name: "Hector Canonge",
    role: "Media & performance artist · New York",
    roleEs: "Artista de medios y performance · Nueva York",
    bio: "Hector Canonge lives and works in New York City, where he studied Comparative Literature, Filmmaking, and Integrated Media Arts. His work incorporates the use of various media, commercial technologies, physical environments, and cinematic and performative narratives. This past spring he was a resident artist at the LMCC Swing Space Program at Governors Island, and a teaching fellow for Artistic Noise. Canonge has been awarded scholarships by Harvestworks, fellowships by NJCU, and has participated in residencies at the Atlantic Center for the Arts, AIM Program 27 at the Bronx Museum of Art, Newark New Media at City Without Walls, Dyson College of Arts and Sciences at Pace University, and The Wassaic Project. His work has been featured at the Queens Museum of Art, Bronx Museum, Jersey City Museum, Exit Art, Flux Factory, Gallery Aferro, NY Studio Gallery, Topaz Arts, Y Gallery, and Grace Exhibition Space, among others.",
    bioEs:
      "Hector Canonge vive y trabaja en la ciudad de Nueva York, donde estudió Literatura Comparada, Cine y Artes de Medios Integrados. Su obra incorpora diversos medios, tecnologías comerciales, entornos físicos y narrativas cinematográficas y performáticas. La primavera pasada fue artista residente del programa LMCC Swing Space en Governors Island y becario docente de Artistic Noise. Canonge ha recibido becas de Harvestworks y de NJCU, y ha participado en residencias en el Atlantic Center for the Arts, el AIM Program 27 del Bronx Museum of Art, Newark New Media en City Without Walls, el Dyson College of Arts and Sciences de Pace University y The Wassaic Project. Su trabajo se ha presentado en el Queens Museum of Art, el Bronx Museum, el Jersey City Museum, Exit Art, Flux Factory, Gallery Aferro, NY Studio Gallery, Topaz Arts, Y Gallery y Grace Exhibition Space, entre otros.",
    image: null,
  },
  {
    name: "Yohana Roa",
    role: "Visual artist & art historian · New York",
    roleEs: "Artista visual e historiadora del arte · Nueva York",
    bio: "Yohana Roa is a transcultural-feminist visual artist, art historian, and art critic based in New York, represented by Ana Tejeda Gallery. She holds a Ph.D. in the History and Critical Theories of Art program from the Universidad Iberoamericana, México, where she graduated Cum Laude with her thesis. She also holds an MA in Women and Gender Studies from the CUNY Graduate Center, an MA in Visual Arts from the National Autonomous University of Mexico, and a Bachelor's degree in Visual Arts from the Departmental Institute of Fine Arts of Colombia, with a meritorious thesis. Her most recent solo performance took place at the Thyssen-Bornemisza Museum in Madrid in 2024.",
    bioEs:
      "Yohana Roa es una artista visual, historiadora y crítica de arte transcultural-feminista radicada en Nueva York, representada por Ana Tejeda Gallery. Es doctora en Historia y Teorías Críticas del Arte por la Universidad Iberoamericana de México, donde se graduó Cum Laude con su tesis. Cuenta además con una maestría en Estudios de la Mujer y de Género del CUNY Graduate Center, una maestría en Artes Visuales de la Universidad Nacional Autónoma de México y una licenciatura en Artes Visuales del Instituto Departamental de Bellas Artes de Colombia, con tesis meritoria. Su más reciente performance en solitario tuvo lugar en el Museo Thyssen-Bornemisza de Madrid en 2024.",
    image: null,
  },
];

// ── Interface strings ─────────────────────────────────────────

export const UI = {
  en: {
    nav: { about: "About", artists: "Artists", videos: "Videos", photos: "Photos", partners: "Partners" },
    seeArtists: "Meet the artists",
    instagram: "Instagram",
    date: "Date",
    time: "Time",
    place: "Place",
    city: "City",
    about: "About",
    presentedBy: "Presented by",
    curatedBy: "Curated by",
    producedBy: "Produced by",
    pillarsKicker: "What happens here",
    pillars: [
      {
        title: "Experimental live arts",
        text: "Live performance, spoken word and poetry, body-based expression, temporary installation and holistic therapy. Artists who move between disciplines instead of staying inside one.",
      },
      {
        title: "The dance floor as ritual",
        text: "DJs and live musicians weave disco, cumbia, salsa, house and global rhythms into ceremonial architecture, rooted in joy, connection and intentional movement.",
      },
      {
        title: "Art, psychology & wellness",
        text: "An evolving platform of experimental formats centered on exploration, care and critical awareness, where creative practice meets psychological insight.",
      },
      {
        title: "Solidarity & equity",
        text: "International solidarity, genuine equity and consciousness, while revealing the contradictions in today's structures of power and ownership.",
      },
    ],
    quote: ["Who owns culture?", "Who gets to heal?"],
    quoteNote: "These questions are not avoided: they are danced through, spoken aloud and held in community.",
    artistsKicker: "Lineup & artists",
    artistsTitle: "Artists",
    artistsIntro: "Everyone who has taken part in ARTeration Fest. Select a name to read their story.",
    readBio: "Bio",
    closeBio: "Close",
    noBio: "More about this artist coming soon.",
    soon: "The lineup will be announced soon.",
    videosKicker: "Watch",
    videos: "Videos",
    videosSoon: "Videos from the festival will live here.",
    photosKicker: "Moments",
    photos: "Photos",
    photosSoon: "Photos from the festival will live here.",
    partnersKicker: "With the support of",
    followUs: "Follow the festival",
    lang: "Language",
    daysToGo: (n: number) => (n === 1 ? "Tomorrow" : `${n} days to go`),
    today: "Happening today",
  },
  es: {
    nav: { about: "Acerca de", artists: "Artistas", videos: "Videos", photos: "Fotos", partners: "Aliados" },
    seeArtists: "Conoce a los artistas",
    instagram: "Instagram",
    date: "Fecha",
    time: "Hora",
    place: "Lugar",
    city: "Ciudad",
    about: "Acerca del festival",
    presentedBy: "Presentado por",
    curatedBy: "Curaduría de",
    producedBy: "Producido por",
    pillarsKicker: "Qué sucede aquí",
    pillars: [
      {
        title: "Artes vivas experimentales",
        text: "Performance en vivo, spoken word y poesía, expresión corporal, instalación temporal y terapia holística. Artistas que se mueven entre disciplinas en lugar de quedarse dentro de una.",
      },
      {
        title: "La pista de baile como ritual",
        text: "DJs y músicos en vivo entretejen disco, cumbia, salsa, house y ritmos del mundo en una arquitectura ceremonial, basada en la alegría, la conexión y el movimiento consciente.",
      },
      {
        title: "Arte, psicología y bienestar",
        text: "Una plataforma en evolución de formatos experimentales centrados en la exploración, el cuidado y la conciencia crítica, donde la práctica creativa se encuentra con la mirada psicológica.",
      },
      {
        title: "Solidaridad y equidad",
        text: "Solidaridad internacional, equidad genuina y conciencia, mientras se revelan las contradicciones de las estructuras actuales de poder y propiedad.",
      },
    ],
    quote: ["¿Quién es dueño de la cultura?", "¿Quién tiene derecho a sanar?"],
    quoteNote: "Estas preguntas no se evitan: se bailan, se dicen en voz alta y se sostienen en comunidad.",
    artistsKicker: "Cartel y artistas",
    artistsTitle: "Artistas",
    artistsIntro: "Todas las personas que han participado en ARTeration Fest. Elige un nombre para leer su historia.",
    readBio: "Bio",
    closeBio: "Cerrar",
    noBio: "Pronto habrá más información sobre este artista.",
    soon: "El cartel se anunciará pronto.",
    videosKicker: "Mira",
    videos: "Videos",
    videosSoon: "Aquí vivirán los videos del festival.",
    photosKicker: "Momentos",
    photos: "Fotos",
    photosSoon: "Aquí vivirán las fotos del festival.",
    partnersKicker: "Con el apoyo de",
    followUs: "Sigue al festival",
    lang: "Idioma",
    daysToGo: (n: number) => (n === 1 ? "Mañana" : `Faltan ${n} días`),
    today: "Es hoy",
  },
} as const;

// ── Default texts for the editable settings (English / Spanish) ──

export const FEST_TEXT_DEFAULTS: Record<string, string> = {
  "fest.tagline": "Where live arts, healing and transdisciplinary experimentation converge.",
  "fest.taglineEs": "Donde convergen las artes vivas, la sanación y la experimentación transdisciplinaria.",
  "fest.date": "Saturday, August 15",
  "fest.dateEs": "Sábado 15 de agosto",
  "fest.aboutTitle": "A living ecosystem of experimental live arts.",
  "fest.aboutTitleEs": "Un ecosistema vivo de artes vivas experimentales.",
  "fest.about1":
    "ARTeration Festival is not a traditional arts gathering. It is a living ecosystem of experimental live arts, dedicated to the bold intersection of creative practice, psychological insight and holistic wellness. The festival champions transdisciplinary artists who fluidly bridge live performance, spoken word and poetry, body-based expression, temporary installation and holistic therapy. They do not work within single disciplines; they move between them, unraveling fixed categories to reveal new forms of emotional and embodied truth.",
  "fest.about1Es":
    "ARTeration Festival no es un encuentro de arte tradicional. Es un ecosistema vivo de artes vivas experimentales, dedicado a la audaz intersección entre la práctica creativa, la mirada psicológica y el bienestar integral. El festival impulsa a artistas transdisciplinarios que tienden puentes entre la performance en vivo, el spoken word y la poesía, la expresión corporal, la instalación temporal y la terapia holística. No trabajan dentro de una sola disciplina: se mueven entre ellas, desarmando categorías fijas para revelar nuevas formas de verdad emocional y corporal.",
  "fest.about2":
    "At the heart of ARTeration lies the dance floor as a ritual space. Each set becomes an invitation to celebrate shared humanity through rhythm, collective release and the universal language of dance, so that participants can shed isolation and remember that aliveness is meant to be felt together.",
  "fest.about2Es":
    "En el corazón de ARTeration está la pista de baile como espacio ritual. Cada set se convierte en una invitación a celebrar nuestra humanidad compartida a través del ritmo, la liberación colectiva y el lenguaje universal de la danza, para soltar el aislamiento y recordar que la vitalidad está hecha para sentirse en conjunto.",
  "fest.about3":
    "The 2026 edition is curated by Alexis Mendoza and features music producer Yongolailan (Carlos José Martínez), alongside an extraordinary lineup of artists. Together they turn ARTeration into a living laboratory, where art, therapy and liberation move as one.",
  "fest.about3Es":
    "La edición 2026 cuenta con la curaduría de Alexis Mendoza y presenta al productor musical Yongolailan (Carlos José Martínez), junto a un cartel extraordinario de artistas. Juntos transforman ARTeration en un laboratorio vivo, donde el arte, la terapia y la liberación se mueven como una sola cosa.",
};
