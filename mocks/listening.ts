export interface ListeningContent {
  id: string;
  title: string;
  content: string;
  translation?: string;
  audioUrl?: string;
  imageUrl?: string;
  source?: string;
  date?: string;
  duration: number; // in seconds
  level: 'beginner' | 'intermediate' | 'advanced';
  vocabulary: Vocabulary[];
}

export interface Vocabulary {
  word: string;
  translation: string;
  definition: string;
  example: string;
}

export const listeningContents: ListeningContent[] = [
  {
    id: 'daily-routine',
    title: 'My Daily Routine',
    content: "Hello! My name is Sarah. I want to tell you about my daily routine. I wake up at 6:30 every morning. First, I brush my teeth and take a shower. Then, I get dressed and have breakfast. I usually have coffee, toast, and eggs. After breakfast, I go to work. I work in an office in the city center. I start work at 9:00 and finish at 5:00. After work, I go to the gym for an hour. Then, I go home and make dinner. I like cooking! After dinner, I watch TV or read a book. I go to bed at around 11:00. That's my typical day!",
    translation: "¡Hola! Mi nombre es Sarah. Quiero contarte sobre mi rutina diaria. Me despierto a las 6:30 todas las mañanas. Primero, me cepillo los dientes y me ducho. Luego, me visto y desayuno. Normalmente tomo café, tostadas y huevos. Después del desayuno, voy al trabajo. Trabajo en una oficina en el centro de la ciudad. Empiezo a trabajar a las 9:00 y termino a las 5:00. Después del trabajo, voy al gimnasio durante una hora. Luego, voy a casa y preparo la cena. ¡Me gusta cocinar! Después de cenar, veo la televisión o leo un libro. Me acuesto alrededor de las 11:00. ¡Ese es mi día típico!",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: "English Learning Materials",
    date: "2023-05-15",
    duration: 90,
    level: 'beginner',
    vocabulary: [
      {
        word: "routine",
        translation: "rutina",
        definition: "a sequence of actions regularly followed",
        example: "My morning routine includes exercise and meditation."
      },
      {
        word: "brush",
        translation: "cepillar",
        definition: "clean or tidy with a brush",
        example: "I brush my teeth twice a day."
      },
      {
        word: "typical",
        translation: "típico",
        definition: "having the distinctive qualities of a particular type of person or thing",
        example: "This is a typical example of his work."
      }
    ]
  },
  {
    id: 'weather-forecast',
    title: 'Today\'s Weather Forecast',
    content: "Good morning, everyone! Here's your weather forecast for today. It's going to be a beautiful sunny day with clear skies. The temperature will reach a high of 75 degrees Fahrenheit or 24 degrees Celsius. There's a light breeze coming from the southwest at about 5 miles per hour. No rain is expected today, so it's perfect for outdoor activities. However, don't forget your sunscreen as the UV index is quite high. Tonight, temperatures will drop to around 60 degrees Fahrenheit or 15 degrees Celsius. Tomorrow, we expect some clouds in the morning, but they should clear up by the afternoon. That's all for today's weather update. Have a great day!",
    translation: "¡Buenos días a todos! Aquí está su pronóstico del tiempo para hoy. Va a ser un hermoso día soleado con cielos despejados. La temperatura alcanzará un máximo de 75 grados Fahrenheit o 24 grados Celsius. Hay una ligera brisa proveniente del suroeste a aproximadamente 5 millas por hora. No se espera lluvia hoy, por lo que es perfecto para actividades al aire libre. Sin embargo, no olvide su protector solar ya que el índice UV es bastante alto. Esta noche, las temperaturas bajarán a alrededor de 60 grados Fahrenheit o 15 grados Celsius. Mañana, esperamos algunas nubes por la mañana, pero deberían despejarse por la tarde. Eso es todo para la actualización del clima de hoy. ¡Que tengan un gran día!",
    imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: "Weather Channel",
    date: "2023-06-20",
    duration: 75,
    level: 'beginner',
    vocabulary: [
      {
        word: "forecast",
        translation: "pronóstico",
        definition: "a prediction of what will happen in the future",
        example: "The weather forecast predicts rain tomorrow."
      },
      {
        word: "breeze",
        translation: "brisa",
        definition: "a gentle wind",
        example: "There was a cool breeze coming from the ocean."
      },
      {
        word: "sunscreen",
        translation: "protector solar",
        definition: "a cream or lotion that protects the skin from the sun's rays",
        example: "Always apply sunscreen before going to the beach."
      }
    ]
  },
  {
    id: 'restaurant-conversation',
    title: 'At the Restaurant',
    content: "Waiter: Good evening! Welcome to The Golden Spoon. Do you have a reservation?\nCustomer: Yes, we have a reservation for two under the name Johnson at 7:30.\nWaiter: Let me check... Yes, here it is. Please follow me to your table.\nCustomer: Thank you.\nWaiter: Here's your table. Here are the menus. Today's special is grilled salmon with roasted vegetables.\nCustomer: That sounds delicious. Can you tell us more about it?\nWaiter: Of course. The salmon is fresh, caught this morning. It's marinated in herbs and lemon, then grilled to perfection. It comes with seasonal vegetables roasted with olive oil and garlic.\nCustomer: I'll have that, please.\nWaiter: Excellent choice. And for you, sir?\nCustomer 2: I'd like the steak, medium-rare, with mashed potatoes.\nWaiter: Very good. Would you like to order some drinks?\nCustomer: Yes, we'll have a bottle of red wine, please.\nWaiter: I'll bring your drinks right away and your food will be ready shortly.",
    translation: "Camarero: ¡Buenas noches! Bienvenidos a The Golden Spoon. ¿Tienen reserva?\nCliente: Sí, tenemos una reserva para dos a nombre de Johnson a las 7:30.\nCamarero: Déjeme verificar... Sí, aquí está. Por favor, síganme a su mesa.\nCliente: Gracias.\nCamarero: Aquí está su mesa. Aquí están los menús. El especial de hoy es salmón a la parrilla con verduras asadas.\nCliente: Eso suena delicioso. ¿Puede decirnos más al respecto?\nCamarero: Por supuesto. El salmón es fresco, pescado esta mañana. Está marinado en hierbas y limón, luego asado a la perfección. Viene con verduras de temporada asadas con aceite de oliva y ajo.\nCliente: Tomaré eso, por favor.\nCamarero: Excelente elección. ¿Y para usted, señor?\nCliente 2: Me gustaría el bistec, término medio, con puré de papas.\nCamarero: Muy bien. ¿Les gustaría pedir algunas bebidas?\nCliente: Sí, tomaremos una botella de vino tinto, por favor.\nCamarero: Traeré sus bebidas de inmediato y su comida estará lista en breve.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: "English Conversations",
    date: "2023-07-10",
    duration: 120,
    level: 'intermediate',
    vocabulary: [
      {
        word: "reservation",
        translation: "reserva",
        definition: "an arrangement to have something kept for someone",
        example: "We made a reservation at the restaurant for 8 PM."
      },
      {
        word: "marinated",
        translation: "marinado",
        definition: "soaked in a sauce to add flavor",
        example: "The chicken is marinated in a special sauce."
      },
      {
        word: "medium-rare",
        translation: "término medio",
        definition: "cooked so that the inside is still red",
        example: "I like my steak medium-rare."
      }
    ]
  },
  {
    id: 'job-interview',
    title: 'Job Interview Tips',
    content: "Preparing for a job interview can be stressful, but with the right preparation, you can increase your chances of success. First, research the company thoroughly. Understand their products, services, culture, and recent news. This shows your interest and helps you tailor your answers to align with their values. Second, practice common interview questions. Think about your strengths, weaknesses, achievements, and how your skills match the job requirements. Use the STAR method (Situation, Task, Action, Result) to structure your answers to behavioral questions. Third, prepare questions to ask the interviewer. This demonstrates your enthusiasm and helps you determine if the company is the right fit for you. Fourth, dress professionally and arrive early. First impressions matter, so dress appropriately for the company culture and position. Plan your route in advance and aim to arrive 10-15 minutes early. Finally, follow up after the interview with a thank-you email. Express your gratitude for the opportunity and reiterate your interest in the position. Remember, an interview is not just about the company evaluating you, but also about you evaluating the company.",
    translation: "Prepararse para una entrevista de trabajo puede ser estresante, pero con la preparación adecuada, puedes aumentar tus posibilidades de éxito. Primero, investiga la empresa a fondo. Comprende sus productos, servicios, cultura y noticias recientes. Esto muestra tu interés y te ayuda a adaptar tus respuestas para alinearse con sus valores. Segundo, practica preguntas comunes de entrevistas. Piensa en tus fortalezas, debilidades, logros y cómo tus habilidades coinciden con los requisitos del trabajo. Utiliza el método STAR (Situación, Tarea, Acción, Resultado) para estructurar tus respuestas a preguntas de comportamiento. Tercero, prepara preguntas para hacerle al entrevistador. Esto demuestra tu entusiasmo y te ayuda a determinar si la empresa es adecuada para ti. Cuarto, vístete profesionalmente y llega temprano. Las primeras impresiones importan, así que vístete apropiadamente para la cultura de la empresa y la posición. Planifica tu ruta con anticipación y trata de llegar 10-15 minutos antes. Finalmente, haz seguimiento después de la entrevista con un correo electrónico de agradecimiento. Expresa tu gratitud por la oportunidad y reitera tu interés en el puesto. Recuerda, una entrevista no solo se trata de que la empresa te evalúe, sino también de que tú evalúes a la empresa.",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: "Career Development",
    date: "2023-08-05",
    duration: 180,
    level: 'intermediate',
    vocabulary: [
      {
        word: "thoroughly",
        translation: "minuciosamente",
        definition: "in a way that is careful and complete",
        example: "She thoroughly researched the topic before writing her paper."
      },
      {
        word: "tailor",
        translation: "adaptar",
        definition: "adapt or adjust to suit a particular purpose",
        example: "The course is tailored to meet the needs of advanced students."
      },
      {
        word: "reiterate",
        translation: "reiterar",
        definition: "say something again or repeatedly",
        example: "Let me reiterate that safety is our top priority."
      }
    ]
  },
  {
    id: 'climate-change',
    title: 'The Impact of Climate Change',
    content: "Climate change is one of the most pressing challenges facing our planet today. It refers to long-term shifts in temperatures and weather patterns, primarily caused by human activities, especially the burning of fossil fuels. These activities release greenhouse gases, such as carbon dioxide and methane, which trap heat in the Earth's atmosphere, leading to global warming. The consequences of climate change are far-reaching and increasingly severe. Rising global temperatures have led to melting ice caps and glaciers, resulting in sea level rise that threatens coastal communities worldwide. Extreme weather events, including hurricanes, floods, droughts, and wildfires, are becoming more frequent and intense. Ecosystems are being disrupted, leading to biodiversity loss as species struggle to adapt to rapidly changing conditions. Agriculture is also affected, with changing rainfall patterns and temperatures impacting crop yields and food security. Addressing climate change requires a multi-faceted approach. Transitioning to renewable energy sources, improving energy efficiency, protecting and restoring forests, and adopting sustainable agricultural practices are all crucial steps. International cooperation, as seen in agreements like the Paris Climate Accord, is essential for coordinated global action. On an individual level, choices about transportation, diet, consumption, and waste can collectively make a significant difference. While the challenges are immense, there is still time to mitigate the worst effects of climate change if decisive action is taken now.",
    translation: "El cambio climático es uno de los desafíos más apremiantes que enfrenta nuestro planeta hoy en día. Se refiere a cambios a largo plazo en las temperaturas y los patrones climáticos, principalmente causados por actividades humanas, especialmente la quema de combustibles fósiles. Estas actividades liberan gases de efecto invernadero, como dióxido de carbono y metano, que atrapan el calor en la atmósfera de la Tierra, lo que lleva al calentamiento global. Las consecuencias del cambio climático son de largo alcance y cada vez más severas. El aumento de las temperaturas globales ha llevado al derretimiento de los casquetes polares y glaciares, resultando en un aumento del nivel del mar que amenaza a las comunidades costeras en todo el mundo. Los eventos climáticos extremos, incluyendo huracanes, inundaciones, sequías e incendios forestales, se están volviendo más frecuentes e intensos. Los ecosistemas están siendo alterados, lo que lleva a la pérdida de biodiversidad a medida que las especies luchan por adaptarse a condiciones que cambian rápidamente. La agricultura también se ve afectada, con cambios en los patrones de lluvia y temperaturas que impactan los rendimientos de los cultivos y la seguridad alimentaria. Abordar el cambio climático requiere un enfoque multifacético. La transición a fuentes de energía renovable, la mejora de la eficiencia energética, la protección y restauración de bosques, y la adopción de prácticas agrícolas sostenibles son pasos cruciales. La cooperación internacional, como se ve en acuerdos como el Acuerdo Climático de París, es esencial para una acción global coordinada. A nivel individual, las elecciones sobre transporte, dieta, consumo y residuos pueden colectivamente hacer una diferencia significativa. Aunque los desafíos son inmensos, todavía hay tiempo para mitigar los peores efectos del cambio climático si se toman acciones decisivas ahora.",
    imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: "Environmental Science Journal",
    date: "2023-09-15",
    duration: 240,
    level: 'advanced',
    vocabulary: [
      {
        word: "pressing",
        translation: "apremiante",
        definition: "requiring quick or immediate action or attention",
        example: "Unemployment is one of the most pressing issues facing the country."
      },
      {
        word: "far-reaching",
        translation: "de largo alcance",
        definition: "having a wide range of effects or influence",
        example: "The decision had far-reaching consequences for the company."
      },
      {
        word: "mitigate",
        translation: "mitigar",
        definition: "make less severe, serious, or painful",
        example: "The government took steps to mitigate the effects of the recession."
      }
    ]
  },
  {
    id: 'artificial-intelligence',
    title: 'The Rise of Artificial Intelligence',
    content: "Artificial Intelligence, or AI, has emerged as one of the most transformative technologies of the 21st century. At its core, AI refers to computer systems designed to perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation. The field has experienced exponential growth in recent years, driven by advances in computing power, the availability of vast amounts of data, and breakthroughs in machine learning algorithms. Machine learning, a subset of AI, enables computers to learn from and make predictions based on data without being explicitly programmed. Deep learning, a further specialized area, uses neural networks with many layers to analyze various factors of data. These technologies are already ubiquitous in our daily lives. Virtual assistants like Siri and Alexa use natural language processing to understand and respond to our queries. Recommendation systems on platforms like Netflix and Amazon analyze our preferences to suggest content or products. In healthcare, AI is being used to diagnose diseases, develop new drugs, and personalize treatment plans. Autonomous vehicles rely on AI to navigate and make split-second decisions. However, the rapid advancement of AI also raises important ethical and societal questions. Concerns about privacy, bias in algorithms, job displacement, and the potential for autonomous weapons systems are all being actively debated. Ensuring that AI is developed responsibly, with appropriate regulations and ethical guidelines, is crucial for maximizing its benefits while minimizing potential harms. As AI continues to evolve, it promises to reshape industries, economies, and societies in profound ways. The challenge for humanity is to harness this powerful technology to address our most pressing problems while ensuring it remains aligned with human values and interests.",
    translation: "La Inteligencia Artificial, o IA, ha emergido como una de las tecnologías más transformadoras del siglo XXI. En su esencia, la IA se refiere a sistemas informáticos diseñados para realizar tareas que típicamente requieren inteligencia humana, como percepción visual, reconocimiento de voz, toma de decisiones y traducción de idiomas. El campo ha experimentado un crecimiento exponencial en los últimos años, impulsado por avances en la potencia de cómputo, la disponibilidad de grandes cantidades de datos y avances en algoritmos de aprendizaje automático. El aprendizaje automático, un subconjunto de la IA, permite a las computadoras aprender y hacer predicciones basadas en datos sin ser programadas explícitamente. El aprendizaje profundo, un área aún más especializada, utiliza redes neuronales con muchas capas para analizar varios factores de los datos. Estas tecnologías ya son ubicuas en nuestra vida diaria. Asistentes virtuales como Siri y Alexa utilizan procesamiento de lenguaje natural para entender y responder a nuestras consultas. Sistemas de recomendación en plataformas como Netflix y Amazon analizan nuestras preferencias para sugerir contenido o productos. En la atención médica, la IA se está utilizando para diagnosticar enfermedades, desarrollar nuevos medicamentos y personalizar planes de tratamiento. Los vehículos autónomos dependen de la IA para navegar y tomar decisiones en fracciones de segundo. Sin embargo, el rápido avance de la IA también plantea importantes cuestiones éticas y sociales. Preocupaciones sobre la privacidad, el sesgo en los algoritmos, el desplazamiento laboral y el potencial para sistemas de armas autónomas están siendo activamente debatidas. Asegurar que la IA se desarrolle de manera responsable, con regulaciones apropiadas y directrices éticas, es crucial para maximizar sus beneficios mientras se minimizan los daños potenciales. A medida que la IA continúa evolucionando, promete remodelar industrias, economías y sociedades de maneras profundas. El desafío para la humanidad es aprovechar esta poderosa tecnología para abordar nuestros problemas más apremiantes mientras se asegura que permanezca alineada con los valores e intereses humanos.",
    imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813a743d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: "Technology Review",
    date: "2023-10-20",
    duration: 300,
    level: 'advanced',
    vocabulary: [
      {
        word: "ubiquitous",
        translation: "ubicuo",
        definition: "present, appearing, or found everywhere",
        example: "Mobile phones have become ubiquitous in modern society."
      },
      {
        word: "exponential",
        translation: "exponencial",
        definition: "becoming more and more rapid",
        example: "The company has experienced exponential growth in the past year."
      },
      {
        word: "autonomous",
        translation: "autónomo",
        definition: "acting independently or having the freedom to do so",
        example: "The car has autonomous driving capabilities."
      }
    ]
  }
];