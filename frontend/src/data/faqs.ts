export interface FAQ {
  q: string;
  a: string;
  showBambuGif?: boolean;
}

export interface FAQCategory {
  category: string;
  icon: string;
  questions: FAQ[];
}

type FaqLanguage = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';

const es: FAQCategory[] = [
  {
    category: 'Primeros pasos',
    icon: '🚀',
    questions: [
      {
        q: '¿Qué es FilamentOS?',
        a: 'FilamentOS es tu sistema operativo de impresiones 3D. Puedes calcular el coste real de tus impresiones, gestionar tu inventario de bobinas, hacer seguimiento de proyectos y ver estadísticas de tu actividad. Todo en un solo sitio.',
      },
      {
        q: '¿Necesito cuenta para usarlo?',
        a: 'No es obligatorio. Puedes usar la Calculadora de costes y generar presupuestos en PDF sin registrarte. Pero si quieres guardar proyectos, acceder al Tracker de series y las Estadísticas, necesitas una cuenta gratuita con Google.',
      },
      {
        q: '¿Es gratuito?',
        a: 'Si. FilamentOS es completamente gratuito. Crea tu cuenta con Google y empieza a usarlo ahora mismo.',
      },
      {
        q: '¿Puedo instalarlo en mi movil?',
        a: 'Si. FilamentOS es una PWA. En Android/Chrome pulsa el menu y "Anadir a pantalla de inicio". En iOS/Safari pulsa Compartir y "Anadir a pantalla de inicio". Funciona como una app nativa.',
      },
    ],
  },
  {
    category: 'Calculadora de costes',
    icon: '🧮',
    questions: [
      {
        q: '¿Como calculo el coste de una impresion?',
        a: 'Ve a "Calculadora de costes" y completa 4 pasos: 1) Detalles del trabajo (nombre, tiempo, peso) 2) Costes de filamento y electricidad 3) Mano de obra y amortizacion de maquina 4) Precio final con margen e IVA. Tambien puedes subir G-code o 3MF para rellenar datos automaticamente.',
      },
      {
        q: '¿Puedo guardar un proyecto calculado?',
        a: 'Si. Cuando termines, pulsa "Guardar proyecto". Debes iniciar sesion. Luego podras cargarlo desde "Proyectos guardados" para repetir o ajustar el precio.',
      },
      {
        q: '¿Como genero un presupuesto en PDF?',
        a: 'Al terminar el calculo, pulsa "Generar PDF". Puedes personalizar logo, nombre de empresa y colores antes de descargarlo.',
      },
    ],
  },
  {
    category: 'Archivos 3MF y G-code',
    icon: '📁',
    questions: [
      {
        q: '¿Que tipo de archivo 3MF necesito?',
        a: 'FilamentOS lee 3MF sliceados (procesados por el slicer). Debe ser un 3MF con G-code embebido, normalmente ".gcode.3mf" en Bambu Studio y OrcaSlicer. Ese archivo trae los metadatos para extraer peso y tiempo automaticamente.',
      },
      {
        q: '¿Como exporto el 3MF correcto desde Bambu Studio?',
        a: 'En Bambu Studio: 1) Abre y configura tu modelo 2) Pulsa Slice 3) Ve a Archivo -> Exportar -> Exportar placa como 3MF sliceado 4) Guarda el archivo. El resultado es .gcode.3mf y ese es el que debes subir.',
        showBambuGif: true,
      },
      {
        q: '¿Como exporto el 3MF correcto desde OrcaSlicer?',
        a: 'En OrcaSlicer: 1) Abre el modelo y configura parametros 2) Pulsa Slice 3) Ve a Archivo -> Exportar -> Exportar como 3MF sliceado 4) Sube el .gcode.3mf generado.',
      },
      {
        q: '¿Por que no funciona con el 3MF original de MakerWorld?',
        a: 'Los 3MF de MakerWorld, Thingiverse o Printables son archivos de diseno, no incluyen datos de impresion. Debes abrirlos en tu slicer, configurarlos y exportar un 3MF sliceado.',
      },
      {
        q: '¿Que datos extrae FilamentOS del 3MF automaticamente?',
        a: 'Extrae nombre del proyecto, placas de impresion, peso por placa y total, tiempo estimado y, cuando existe, tipo/color de filamento. Si algo falla, puedes editarlo manualmente.',
      },
      {
        q: '¿Puedo subir G-code directamente?',
        a: 'Si. FilamentOS acepta .gcode ademas de .gcode.3mf. El G-code suele incluir comentarios con peso y tiempo para autocompletar campos.',
      },
    ],
  },
  {
    category: 'Inventario de bobinas',
    icon: '🧵',
    questions: [
      {
        q: '¿Como anado una bobina al inventario?',
        a: 'Ve a "Inventario" y pulsa "+ Anadir bobina". Completa marca, material, color, peso y precio. Tambien puedes usar "Escanear etiqueta" para leer codigo de barras o QR.',
      },
      {
        q: '¿Como descuento filamento de una bobina?',
        a: 'Al guardar un proyecto, FilamentOS te pide la bobina usada y descuenta gramos automaticamente. Tambien puedes hacer descuentos manuales desde el inventario.',
      },
      {
        q: '¿Que significa el porcentaje en cada bobina?',
        a: 'Es el porcentaje de filamento restante respecto al peso original. Cuando baja del umbral configurado, aparece en "Stock bajo".',
      },
    ],
  },
  {
    category: 'Tracker de series',
    icon: '📊',
    questions: [
      {
        q: '¿Que es el Tracker de series?',
        a: 'Permite crear proyectos de produccion: series de piezas, retos o encargos. Cada proyecto muestra progreso, coste acumulado, filamento usado y tiempo invertido.',
      },
      {
        q: '¿Puedo hacer seguimiento de un reto de 30 dias?',
        a: 'Si. Crea un proyecto, define la cantidad total de piezas y registra cada una al terminarla. FilamentOS calcula progreso, filamento y coste acumulado.',
      },
    ],
  },
  {
    category: 'Estadisticas',
    icon: '📈',
    questions: [
      {
        q: '¿Que me muestran las estadisticas?',
        a: 'Muestran piezas impresas, kg de filamento, coste total, tiempo de impresion, actividad por tiempo y coste por proyecto. Puedes filtrar por periodos.',
      },
      {
        q: '¿Puedo exportar mis estadisticas?',
        a: 'Si. Desde el panel puedes exportar CSV de tendencia por periodo y CSV de desglose por proyecto.',
      },
    ],
  },
  {
    category: 'Cuenta y privacidad',
    icon: '🔒',
    questions: [
      {
        q: '¿Que datos guarda FilamentOS?',
        a: 'Solo guarda datos que introduces: proyectos, bobinas, estadisticas y configuracion de cuenta. No usa cookies de seguimiento ni publicidad.',
      },
      {
        q: '¿Puedo borrar mi cuenta?',
        a: 'Si. Escribenos a luprintech@gmail.com desde el email de tu cuenta y eliminamos los datos en un maximo de 30 dias.',
      },
      {
        q: '¿FilamentOS cumple RGPD?',
        a: 'Si. FilamentOS cumple RGPD y LSSI. Puedes revisar la politica de privacidad en el pie de pagina.',
      },
    ],
  },
  {
    category: 'Problemas frecuentes',
    icon: '⚠️',
    questions: [
      {
        q: 'El analisis del 3MF no extrae datos correctamente',
        a: 'Verifica que sea un 3MF sliceado (.gcode.3mf), no el 3MF de diseno original. Si sigue fallando, ingresa datos manualmente y reporta el archivo a soporte.',
      },
      {
        q: 'No puedo iniciar sesion con Google',
        a: 'Comprueba conexion y cookies habilitadas. En iOS/Safari desactiva "Bloquear todas las cookies". Si persiste, prueba modo incognito.',
      },
      {
        q: 'La app no carga en mi movil',
        a: 'FilamentOS funciona mejor en Chrome (Android) y Safari (iOS). Prueba limpiar cache o reinstalar la PWA.',
      },
      {
        q: '¿Como reporto un bug?',
        a: 'Escribenos a luprintech@gmail.com con navegador y pasos para reproducir. Tambien puedes abrir un issue en github.com/Luprintech/filamentOS.',
      },
    ],
  },
  {
    category: 'Instalar como app',
    icon: '📱',
    questions: [
      {
        q: '¿Puedo instalar FilamentOS como app en mi movil?',
        a: 'Si. FilamentOS es una PWA que puedes instalar en movil o tablet para usarla como app nativa.',
      },
      {
        q: '¿Como instalo FilamentOS en Android?',
        a: 'En Chrome Android: abre FilamentOS, menu (⋮), "Anadir a pantalla de inicio" o "Instalar app", y confirma.',
      },
      {
        q: '¿Como instalo FilamentOS en iPhone/iPad?',
        a: 'En Safari iOS: abre FilamentOS, pulsa Compartir, "Anadir a pantalla de inicio", y confirma.',
      },
      {
        q: '¿Que ventajas tiene instalar FilamentOS como app?',
        a: 'Acceso directo, modo app a pantalla completa, cache offline y menor dependencia del navegador.',
      },
    ],
  },
  {
    category: 'Proximas funciones',
    icon: '✨',
    questions: [
      {
        q: '¿Que es el monitoreo de impresoras en tiempo real?',
        a: 'Permitira conectar impresoras (Bambu Lab, OctoPrint, Klipper) para ver estado, progreso, temperaturas, consumo y tiempo restante en vivo.',
      },
      {
        q: '¿Que impresoras seran compatibles?',
        a: 'Se planea soporte para Bambu Lab via MQTT, OctoPrint y Klipper/Moonraker via APIs en tiempo real.',
      },
      {
        q: '¿Que es el comparador de filamentos?',
        a: 'Comparara 2-4 filamentos por coste, stock y propiedades para elegir el mas rentable para cada proyecto.',
      },
      {
        q: '¿Que es el feed de proyectos publicos?',
        a: 'Sera una seccion para compartir proyectos (opcionales y anonimos) con filtros, referencias y plantillas reutilizables.',
      },
    ],
  },
];

const en: FAQCategory[] = [
  {
    category: 'Getting started',
    icon: '🚀',
    questions: [
      {
        q: 'What is FilamentOS?',
        a: 'FilamentOS is your 3D printing operating system. You can calculate real print costs, manage spool inventory, track projects, and review your production stats in one place.',
      },
      {
        q: 'Do I need an account to use it?',
        a: 'Not required. You can use the cost calculator and generate PDF quotes without signing up. To save projects, use the tracker, and access stats, you need a free Google account.',
      },
      {
        q: 'Is it free?',
        a: 'Yes. FilamentOS is completely free to use.',
      },
      {
        q: 'Can I install it on my phone?',
        a: 'Yes. FilamentOS is a PWA. On Android/Chrome use menu -> Add to Home screen. On iOS/Safari use Share -> Add to Home screen.',
      },
    ],
  },
  {
    category: 'Cost calculator',
    icon: '🧮',
    questions: [
      {
        q: 'How do I calculate a print cost?',
        a: 'Go to Cost Calculator and complete 4 steps: job details, filament/electricity, labor/depreciation, and final price with margin/tax. You can also upload G-code or 3MF to auto-fill values.',
      },
      {
        q: 'Can I save a calculated project?',
        a: 'Yes. Click Save project after calculation. You need to be signed in. Then you can reload it later from Saved projects.',
      },
      {
        q: 'How do I generate a PDF quote?',
        a: 'After calculating, click Generate PDF. You can customize logo, company name, and colors before downloading.',
      },
    ],
  },
  {
    category: '3MF and G-code files',
    icon: '📁',
    questions: [
      {
        q: 'What kind of 3MF file do I need?',
        a: 'Use a sliced 3MF (processed by the slicer), usually a .gcode.3mf file. It includes print metadata needed to extract time and weight.',
      },
      {
        q: 'How do I export the right 3MF from Bambu Studio?',
        a: 'In Bambu Studio: open model, slice it, go to File -> Export -> Export plate as sliced 3MF, then save. Upload the resulting .gcode.3mf file.',
        showBambuGif: true,
      },
      {
        q: 'How do I export the right 3MF from OrcaSlicer?',
        a: 'In OrcaSlicer: open and configure model, click Slice, then File -> Export -> Export as sliced 3MF. Upload the generated .gcode.3mf file.',
      },
      {
        q: 'Why does the original MakerWorld 3MF not work?',
        a: 'Those are design files, not sliced print files. Open them in your slicer, configure settings, and export a sliced 3MF.',
      },
      {
        q: 'What data does FilamentOS extract from 3MF automatically?',
        a: 'Project name, print plates, filament weight per plate and total, estimated print time, and when available, filament type/color.',
      },
      {
        q: 'Can I upload G-code directly?',
        a: 'Yes. FilamentOS accepts .gcode and .gcode.3mf files.',
      },
    ],
  },
  {
    category: 'Spool inventory',
    icon: '🧵',
    questions: [
      {
        q: 'How do I add a spool to inventory?',
        a: 'Go to Inventory and click + Add spool. Enter brand, material, color, weight, and price. You can also scan the spool label with QR/barcode.',
      },
      {
        q: 'How do I deduct filament from a spool?',
        a: 'When saving a project, FilamentOS asks which spool was used and deducts grams automatically. You can also deduct manually from inventory.',
      },
      {
        q: 'What does the spool percentage mean?',
        a: 'It is remaining filament percentage relative to the original spool weight. Low stock appears under low-stock alerts.',
      },
    ],
  },
  {
    category: 'Project tracker',
    icon: '📊',
    questions: [
      {
        q: 'What is the project tracker?',
        a: 'It lets you manage production projects: series, challenges, or client jobs. Each project tracks progress, total cost, used filament, and time spent.',
      },
      {
        q: 'Can I track a 30-day challenge?',
        a: 'Yes. Create a project, set total pieces, and register each completed piece. FilamentOS updates progress and totals automatically.',
      },
    ],
  },
  {
    category: 'Statistics',
    icon: '📈',
    questions: [
      {
        q: 'What do statistics show?',
        a: 'Printed pieces, filament usage, total cost, print time, activity trends, and cost per project with date filters.',
      },
      {
        q: 'Can I export my stats?',
        a: 'Yes. Export CSV by trend period and by project breakdown.',
      },
    ],
  },
  {
    category: 'Account and privacy',
    icon: '🔒',
    questions: [
      {
        q: 'What data does FilamentOS store?',
        a: 'Only data you enter: projects, spools, print stats, and account settings. No tracking/ads cookies are used.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Email luprintech@gmail.com from your account email and data will be removed within up to 30 days.',
      },
      {
        q: 'Is FilamentOS GDPR-compliant?',
        a: 'Yes. FilamentOS follows GDPR and related privacy requirements.',
      },
    ],
  },
  {
    category: 'Common issues',
    icon: '⚠️',
    questions: [
      {
        q: '3MF analysis does not extract data correctly',
        a: 'Make sure it is a sliced .gcode.3mf file, not the original design 3MF. If needed, enter data manually and contact support.',
      },
      {
        q: 'I cannot sign in with Google',
        a: 'Check internet and cookie settings. On iOS/Safari, disable "Block all cookies". Try private mode if needed.',
      },
      {
        q: 'The app does not load on my phone',
        a: 'FilamentOS works best on Chrome (Android) and Safari (iOS). Try clearing cache or reinstalling the PWA.',
      },
      {
        q: 'How do I report a bug?',
        a: 'Email luprintech@gmail.com with browser and reproduction steps, or open an issue at github.com/Luprintech/filamentOS.',
      },
    ],
  },
  {
    category: 'Install as app',
    icon: '📱',
    questions: [
      {
        q: 'Can I install FilamentOS as an app?',
        a: 'Yes. FilamentOS is a PWA and can be installed on mobile/tablet like a native app.',
      },
      {
        q: 'How do I install FilamentOS on Android?',
        a: 'In Chrome on Android: open FilamentOS, tap menu (⋮), choose "Add to Home screen" or "Install app", and confirm.',
      },
      {
        q: 'How do I install FilamentOS on iPhone/iPad?',
        a: 'In Safari on iOS: open FilamentOS, tap Share, choose "Add to Home Screen", and confirm.',
      },
      {
        q: 'What are the advantages of installing as an app?',
        a: 'Home screen shortcut, app-like full screen, offline cache, and faster access.',
      },
    ],
  },
  {
    category: 'Upcoming features',
    icon: '✨',
    questions: [
      {
        q: 'What is real-time printer monitoring?',
        a: 'An upcoming feature to connect printers (Bambu Lab, OctoPrint, Klipper) and view live status, progress, temperatures, filament usage, and time left.',
      },
      {
        q: 'Which printers will be compatible?',
        a: 'Planned support includes Bambu Lab via MQTT and OctoPrint/Klipper-Moonraker via real-time APIs.',
      },
      {
        q: 'What is the filament comparator?',
        a: 'A tool to compare 2-4 filaments by cost, stock, and properties to choose the best one for each print.',
      },
      {
        q: 'What is the public projects feed?',
        a: 'A community section to share optional public projects with filters, references, and reusable templates.',
      },
    ],
  },
];

const pt: FAQCategory[] = [
  {
    category: 'Primeiros passos',
    icon: '🚀',
    questions: [
      { q: 'O que e o FilamentOS?', a: 'FilamentOS e seu sistema operacional para impressao 3D. Voce pode calcular custos reais, gerenciar bobinas, acompanhar projetos e ver estatisticas em um so lugar.' },
      { q: 'Preciso de conta para usar?', a: 'Nao e obrigatorio. Voce pode usar a calculadora e gerar PDFs sem cadastro. Para salvar projetos, usar o tracker e estatisticas, precisa de conta Google gratuita.' },
      { q: 'E gratuito?', a: 'Sim. O FilamentOS e totalmente gratuito.' },
      { q: 'Posso instalar no celular?', a: 'Sim. O FilamentOS e uma PWA. No Android/Chrome use menu -> Adicionar a tela inicial. No iOS/Safari use Compartilhar -> Adicionar a tela inicial.' },
    ],
  },
  {
    category: 'Calculadora de custos',
    icon: '🧮',
    questions: [
      { q: 'Como calculo o custo de uma impressao?', a: 'Vá para Calculadora de custos e complete 4 etapas: detalhes, filamento/energia, mao de obra/depreciacao e preco final com margem/imposto. Tambem pode enviar G-code ou 3MF para auto preenchimento.' },
      { q: 'Posso salvar um projeto calculado?', a: 'Sim. Clique em Salvar projeto ao final. E necessario estar logado. Depois voce pode recarregar em Projetos salvos.' },
      { q: 'Como gero um orcamento em PDF?', a: 'Depois do calculo, clique em Gerar PDF. Voce pode personalizar logo, nome da empresa e cores antes de baixar.' },
    ],
  },
  {
    category: 'Arquivos 3MF e G-code',
    icon: '📁',
    questions: [
      { q: 'Que tipo de arquivo 3MF eu preciso?', a: 'Use um 3MF fatiado (processado no slicer), normalmente .gcode.3mf. Ele contem metadados para extrair tempo e peso.' },
      { q: 'Como exporto o 3MF correto no Bambu Studio?', a: 'No Bambu Studio: abra o modelo, faca o slice, va em File -> Export -> Export plate as sliced 3MF, salve e envie o arquivo .gcode.3mf.' , showBambuGif: true },
      { q: 'Como exporto o 3MF correto no OrcaSlicer?', a: 'No OrcaSlicer: abra e configure o modelo, clique em Slice, depois File -> Export -> Export as sliced 3MF e envie o .gcode.3mf gerado.' },
      { q: 'Por que o 3MF original do MakerWorld nao funciona?', a: 'Esses sao arquivos de design, nao de impressao fatiada. Abra no slicer, configure e exporte um 3MF fatiado.' },
      { q: 'Quais dados o FilamentOS extrai automaticamente do 3MF?', a: 'Nome do projeto, placas, peso por placa e total, tempo estimado e, quando disponivel, tipo/cor do filamento.' },
      { q: 'Posso enviar G-code diretamente?', a: 'Sim. O FilamentOS aceita arquivos .gcode e .gcode.3mf.' },
    ],
  },
  {
    category: 'Inventario de bobinas',
    icon: '🧵',
    questions: [
      { q: 'Como adiciono uma bobina ao inventario?', a: 'Vá para Inventario e clique em + Adicionar bobina. Informe marca, material, cor, peso e preco. Tambem pode escanear a etiqueta.' },
      { q: 'Como desconto filamento de uma bobina?', a: 'Ao salvar um projeto, o FilamentOS pergunta qual bobina foi usada e desconta automaticamente. Tambem e possivel descontar manualmente.' },
      { q: 'O que significa a porcentagem da bobina?', a: 'E o percentual restante em relacao ao peso original da bobina. Estoque baixo aparece em alertas.' },
    ],
  },
  {
    category: 'Tracker de projetos',
    icon: '📊',
    questions: [
      { q: 'O que e o tracker de projetos?', a: 'Permite gerenciar projetos de producao: series, desafios ou pedidos. Cada projeto mostra progresso, custo, filamento usado e tempo.' },
      { q: 'Posso acompanhar um desafio de 30 dias?', a: 'Sim. Crie um projeto, defina total de pecas e registre cada peca concluida. O FilamentOS atualiza os totais automaticamente.' },
    ],
  },
  {
    category: 'Estatisticas',
    icon: '📈',
    questions: [
      { q: 'O que as estatisticas mostram?', a: 'Pecas impressas, uso de filamento, custo total, tempo de impressao, tendencia de atividade e custo por projeto com filtros de data.' },
      { q: 'Posso exportar minhas estatisticas?', a: 'Sim. Voce pode exportar CSV por tendencia e por projeto.' },
    ],
  },
  {
    category: 'Conta e privacidade',
    icon: '🔒',
    questions: [
      { q: 'Quais dados o FilamentOS armazena?', a: 'Apenas dados inseridos por voce: projetos, bobinas, estatisticas e configuracoes da conta. Nao usamos cookies de rastreamento.' },
      { q: 'Posso excluir minha conta?', a: 'Sim. Envie email para luprintech@gmail.com com o email da conta e os dados serao removidos em ate 30 dias.' },
      { q: 'O FilamentOS e compativel com GDPR?', a: 'Sim. O FilamentOS segue requisitos de GDPR e privacidade relacionados.' },
    ],
  },
  {
    category: 'Problemas comuns',
    icon: '⚠️',
    questions: [
      { q: 'A analise do 3MF nao extrai dados corretamente', a: 'Confirme que o arquivo e .gcode.3mf fatiado, nao o 3MF de design original. Se preciso, preencha manualmente e contate o suporte.' },
      { q: 'Nao consigo entrar com Google', a: 'Verifique internet e cookies. No iOS/Safari, desative "Bloquear todos os cookies". Tente modo privado se necessario.' },
      { q: 'O app nao carrega no celular', a: 'O FilamentOS funciona melhor no Chrome (Android) e Safari (iOS). Tente limpar cache ou reinstalar a PWA.' },
      { q: 'Como reporto um bug?', a: 'Envie email para luprintech@gmail.com com navegador e passos de reproducao, ou abra issue em github.com/Luprintech/filamentOS.' },
    ],
  },
  {
    category: 'Instalar como app',
    icon: '📱',
    questions: [
      { q: 'Posso instalar o FilamentOS como app?', a: 'Sim. O FilamentOS e uma PWA e pode ser instalado em celular/tablet como app nativo.' },
      { q: 'Como instalo o FilamentOS no Android?', a: 'No Chrome Android: abra o FilamentOS, toque no menu (⋮), escolha "Adicionar a tela inicial" ou "Instalar app" e confirme.' },
      { q: 'Como instalo o FilamentOS no iPhone/iPad?', a: 'No Safari iOS: abra o FilamentOS, toque em Compartilhar, escolha "Adicionar a Tela de Inicio" e confirme.' },
      { q: 'Quais vantagens de instalar como app?', a: 'Atalho na tela inicial, modo tela cheia, cache offline e acesso mais rapido.' },
    ],
  },
  {
    category: 'Proximos recursos',
    icon: '✨',
    questions: [
      { q: 'O que e monitoramento de impressora em tempo real?', a: 'Recurso futuro para conectar impressoras (Bambu Lab, OctoPrint, Klipper) e ver status, progresso, temperaturas, consumo e tempo restante ao vivo.' },
      { q: 'Quais impressoras serao compativeis?', a: 'Suporte planejado para Bambu Lab via MQTT e OctoPrint/Klipper-Moonraker via APIs em tempo real.' },
      { q: 'O que e comparador de filamentos?', a: 'Ferramenta para comparar 2-4 filamentos por custo, estoque e propriedades para escolher o melhor em cada impressao.' },
      { q: 'O que e feed de projetos publicos?', a: 'Secao da comunidade para compartilhar projetos publicos opcionais com filtros, referencias e modelos reutilizaveis.' },
    ],
  },
];

const fr: FAQCategory[] = [
  {
    category: 'Demarrage',
    icon: '🚀',
    questions: [
      { q: 'Qu est-ce que FilamentOS ?', a: 'FilamentOS est votre systeme d exploitation pour l impression 3D. Vous pouvez calculer les couts reels, gerer les bobines, suivre les projets et consulter les statistiques.' },
      { q: 'Ai-je besoin d un compte ?', a: 'Pas obligatoire. Vous pouvez utiliser la calculatrice et generer des PDF sans compte. Pour sauvegarder des projets et utiliser le suivi/statistiques, un compte Google gratuit est requis.' },
      { q: 'Est-ce gratuit ?', a: 'Oui. FilamentOS est entierement gratuit.' },
      { q: 'Puis-je l installer sur mon telephone ?', a: 'Oui. FilamentOS est une PWA. Sur Android/Chrome: menu -> Ajouter a l ecran d accueil. Sur iOS/Safari: Partager -> Ajouter a l ecran d accueil.' },
    ],
  },
  {
    category: 'Calculatrice de couts',
    icon: '🧮',
    questions: [
      { q: 'Comment calculer le cout d une impression ?', a: 'Allez dans la calculatrice et completez 4 etapes: details, filament/energie, main d oeuvre/amortissement, puis prix final avec marge/taxe. Vous pouvez aussi importer G-code ou 3MF.' },
      { q: 'Puis-je sauvegarder un projet calcule ?', a: 'Oui. Cliquez sur Sauvegarder le projet apres le calcul. Connexion requise. Vous pourrez le recharger plus tard.' },
      { q: 'Comment generer un devis PDF ?', a: 'Apres le calcul, cliquez sur Generer PDF. Vous pouvez personnaliser logo, nom de societe et couleurs avant telechargement.' },
    ],
  },
  {
    category: 'Fichiers 3MF et G-code',
    icon: '📁',
    questions: [
      { q: 'Quel type de fichier 3MF faut-il ?', a: 'Utilisez un 3MF tranche (sliced), generalement .gcode.3mf. Il contient les metadonnees d impression (temps et poids).' },
      { q: 'Comment exporter le bon 3MF depuis Bambu Studio ?', a: 'Dans Bambu Studio: ouvrez le modele, lancez le slice, puis File -> Export -> Export plate as sliced 3MF. Envoyez ensuite le fichier .gcode.3mf.' , showBambuGif: true },
      { q: 'Comment exporter le bon 3MF depuis OrcaSlicer ?', a: 'Dans OrcaSlicer: configurez le modele, cliquez Slice, puis File -> Export -> Export as sliced 3MF et envoyez le .gcode.3mf genere.' },
      { q: 'Pourquoi le 3MF original MakerWorld ne fonctionne pas ?', a: 'Ce sont des fichiers de conception, pas des fichiers d impression tranches. Ouvrez-les dans le slicer, configurez, puis exportez un 3MF tranche.' },
      { q: 'Quelles donnees FilamentOS extrait-il automatiquement du 3MF ?', a: 'Nom du projet, plateaux, poids par plateau et total, temps estime, et quand disponible, type/couleur du filament.' },
      { q: 'Puis-je televerser du G-code directement ?', a: 'Oui. FilamentOS accepte les fichiers .gcode et .gcode.3mf.' },
    ],
  },
  {
    category: 'Inventaire des bobines',
    icon: '🧵',
    questions: [
      { q: 'Comment ajouter une bobine a l inventaire ?', a: 'Allez dans Inventaire, cliquez + Ajouter une bobine et renseignez marque, materiau, couleur, poids et prix. Vous pouvez aussi scanner l etiquette.' },
      { q: 'Comment deduire du filament d une bobine ?', a: 'Lors de la sauvegarde d un projet, FilamentOS demande la bobine utilisee et deduit automatiquement les grammes. Deduction manuelle possible aussi.' },
      { q: 'Que signifie le pourcentage de bobine ?', a: 'C est le pourcentage restant par rapport au poids d origine. Le stock faible apparait dans les alertes.' },
    ],
  },
  {
    category: 'Suivi de projets',
    icon: '📊',
    questions: [
      { q: 'Qu est-ce que le suivi de projets ?', a: 'Il permet de gerer des projets de production: series, defis ou commandes client. Chaque projet suit progression, cout total, filament et temps.' },
      { q: 'Puis-je suivre un defi de 30 jours ?', a: 'Oui. Creez un projet, definissez le total de pieces et enregistrez chaque piece terminee. Les totaux se mettent a jour automatiquement.' },
    ],
  },
  {
    category: 'Statistiques',
    icon: '📈',
    questions: [
      { q: 'Que montrent les statistiques ?', a: 'Pieces imprimees, usage de filament, cout total, temps d impression, tendance d activite et cout par projet avec filtres de date.' },
      { q: 'Puis-je exporter mes statistiques ?', a: 'Oui. Export CSV par tendance et par projet.' },
    ],
  },
  {
    category: 'Compte et confidentialite',
    icon: '🔒',
    questions: [
      { q: 'Quelles donnees FilamentOS stocke-t-il ?', a: 'Uniquement les donnees saisies: projets, bobines, stats et parametres de compte. Pas de cookies publicitaires/de suivi.' },
      { q: 'Puis-je supprimer mon compte ?', a: 'Oui. Ecrivez a luprintech@gmail.com depuis l email du compte et les donnees seront supprimees sous 30 jours maximum.' },
      { q: 'FilamentOS est-il conforme au RGPD ?', a: 'Oui. FilamentOS respecte le RGPD et les exigences de confidentialite associees.' },
    ],
  },
  {
    category: 'Problemes courants',
    icon: '⚠️',
    questions: [
      { q: 'L analyse 3MF n extrait pas correctement les donnees', a: 'Verifiez que le fichier est un .gcode.3mf tranche, et non le 3MF de conception original. Sinon, saisissez les donnees manuellement et contactez le support.' },
      { q: 'Impossible de me connecter avec Google', a: 'Verifiez internet et cookies. Sur iOS/Safari, desactivez "Block all cookies". Essayez le mode prive si besoin.' },
      { q: 'L application ne se charge pas sur mon telephone', a: 'FilamentOS fonctionne mieux sur Chrome (Android) et Safari (iOS). Essayez de vider le cache ou de reinstaller la PWA.' },
      { q: 'Comment signaler un bug ?', a: 'Envoyez un email a luprintech@gmail.com avec navigateur et etapes de reproduction, ou ouvrez une issue sur github.com/Luprintech/filamentOS.' },
    ],
  },
  {
    category: 'Installer comme application',
    icon: '📱',
    questions: [
      { q: 'Puis-je installer FilamentOS comme application ?', a: 'Oui. FilamentOS est une PWA installable sur mobile/tablette comme une app native.' },
      { q: 'Comment installer FilamentOS sur Android ?', a: 'Dans Chrome Android: ouvrez FilamentOS, menu (⋮), choisissez "Add to Home screen" ou "Install app", puis confirmez.' },
      { q: 'Comment installer FilamentOS sur iPhone/iPad ?', a: 'Dans Safari iOS: ouvrez FilamentOS, appuyez sur Partager, choisissez "Add to Home Screen" et confirmez.' },
      { q: 'Quels avantages a l installer comme application ?', a: 'Raccourci ecran d accueil, mode plein ecran, cache hors ligne et acces plus rapide.' },
    ],
  },
  {
    category: 'Fonctionnalites a venir',
    icon: '✨',
    questions: [
      { q: 'Qu est-ce que la surveillance d imprimante en temps reel ?', a: 'Fonction a venir pour connecter des imprimantes (Bambu Lab, OctoPrint, Klipper) et voir statut, progression, temperatures, consommation et temps restant en direct.' },
      { q: 'Quelles imprimantes seront compatibles ?', a: 'Support prevu: Bambu Lab via MQTT et OctoPrint/Klipper-Moonraker via API temps reel.' },
      { q: 'Qu est-ce que le comparateur de filaments ?', a: 'Outil pour comparer 2 a 4 filaments selon cout, stock et proprietes pour choisir le meilleur.' },
      { q: 'Qu est-ce que le flux de projets publics ?', a: 'Section communautaire pour partager des projets publics optionnels avec filtres, references et modeles reutilisables.' },
    ],
  },
];

const de: FAQCategory[] = [
  {
    category: 'Erste Schritte',
    icon: '🚀',
    questions: [
      { q: 'Was ist FilamentOS?', a: 'FilamentOS ist dein Betriebssystem fur 3D-Druck. Du kannst reale Druckkosten berechnen, Spulen verwalten, Projekte verfolgen und Statistiken sehen.' },
      { q: 'Brauche ich ein Konto?', a: 'Nicht zwingend. Rechner und PDFs gehen ohne Konto. Fur gespeicherte Projekte, Tracker und Statistiken brauchst du ein kostenloses Google-Konto.' },
      { q: 'Ist es kostenlos?', a: 'Ja. FilamentOS ist komplett kostenlos.' },
      { q: 'Kann ich es auf dem Handy installieren?', a: 'Ja. FilamentOS ist eine PWA. Android/Chrome: Menu -> Zum Startbildschirm hinzufugen. iOS/Safari: Teilen -> Zum Startbildschirm.' },
    ],
  },
  {
    category: 'Kostenrechner',
    icon: '🧮',
    questions: [
      { q: 'Wie berechne ich Druckkosten?', a: 'Gehe zum Kostenrechner und fulle 4 Schritte aus: Details, Filament/Strom, Arbeit/Abschreibung und Endpreis mit Marge/Steuer. G-code oder 3MF kann automatisch ausfullen.' },
      { q: 'Kann ich ein berechnetes Projekt speichern?', a: 'Ja. Nach der Berechnung auf Projekt speichern klicken. Anmeldung erforderlich. Danach kannst du es in Gespeicherte Projekte neu laden.' },
      { q: 'Wie erstelle ich ein PDF-Angebot?', a: 'Nach der Berechnung auf PDF generieren klicken. Logo, Firmenname und Farben lassen sich vor dem Download anpassen.' },
    ],
  },
  {
    category: '3MF- und G-code-Dateien',
    icon: '📁',
    questions: [
      { q: 'Welche 3MF-Datei brauche ich?', a: 'Nutze eine geslicte 3MF-Datei, meist .gcode.3mf. Sie enthalt Druck-Metadaten fur Zeit und Gewicht.' },
      { q: 'Wie exportiere ich die richtige 3MF aus Bambu Studio?', a: 'In Bambu Studio: Modell offnen, slicen, dann File -> Export -> Export plate as sliced 3MF. Danach die .gcode.3mf hochladen.' , showBambuGif: true },
      { q: 'Wie exportiere ich die richtige 3MF aus OrcaSlicer?', a: 'In OrcaSlicer: Modell konfigurieren, Slice klicken, dann File -> Export -> Export as sliced 3MF und die erzeugte .gcode.3mf hochladen.' },
      { q: 'Warum funktioniert die originale MakerWorld-3MF nicht?', a: 'Das sind Design-Dateien, keine geslicten Druckdateien. Im Slicer offnen, konfigurieren und als geslicte 3MF exportieren.' },
      { q: 'Welche Daten extrahiert FilamentOS automatisch aus 3MF?', a: 'Projektname, Druckplatten, Filamentgewicht pro Platte und gesamt, geschatzte Druckzeit sowie ggf. Filamenttyp/-farbe.' },
      { q: 'Kann ich G-code direkt hochladen?', a: 'Ja. FilamentOS akzeptiert .gcode und .gcode.3mf Dateien.' },
    ],
  },
  {
    category: 'Spuleninventar',
    icon: '🧵',
    questions: [
      { q: 'Wie fage ich eine Spule zum Inventar hinzu?', a: 'Gehe zu Inventar und klicke + Spule hinzufugen. Marke, Material, Farbe, Gewicht und Preis eingeben. Etikett-Scan ist auch moglich.' },
      { q: 'Wie buche ich Filament von einer Spule ab?', a: 'Beim Speichern eines Projekts fragt FilamentOS nach der verwendeten Spule und zieht Gramm automatisch ab. Manuell geht ebenfalls.' },
      { q: 'Was bedeutet der Prozentwert an der Spule?', a: 'Das ist der verbleibende Anteil bezogen auf das Originalgewicht. Niedriger Bestand erscheint in Warnungen.' },
    ],
  },
  {
    category: 'Projekt-Tracker',
    icon: '📊',
    questions: [
      { q: 'Was ist der Projekt-Tracker?', a: 'Damit verwaltest du Produktionsprojekte: Serien, Challenges oder Kundenauftrage. Jedes Projekt zeigt Fortschritt, Kosten, Filament und Zeit.' },
      { q: 'Kann ich eine 30-Tage-Challenge tracken?', a: 'Ja. Projekt anlegen, Gesamtanzahl festlegen und jede fertige Einheit erfassen. FilamentOS aktualisiert die Summen automatisch.' },
    ],
  },
  {
    category: 'Statistiken',
    icon: '📈',
    questions: [
      { q: 'Was zeigen die Statistiken?', a: 'Gedruckte Teile, Filamentverbrauch, Gesamtkosten, Druckzeit, Aktivitatstrends und Kosten pro Projekt mit Datumsfiltern.' },
      { q: 'Kann ich meine Statistiken exportieren?', a: 'Ja. CSV-Export nach Trendzeitraum und nach Projektaufschlusselung.' },
    ],
  },
  {
    category: 'Konto und Datenschutz',
    icon: '🔒',
    questions: [
      { q: 'Welche Daten speichert FilamentOS?', a: 'Nur Daten, die du eingibst: Projekte, Spulen, Statistiken und Kontoeinstellungen. Keine Tracking-/Werbe-Cookies.' },
      { q: 'Kann ich mein Konto loschen?', a: 'Ja. Schreibe an luprintech@gmail.com mit deiner Konto-E-Mail. Daten werden innerhalb von bis zu 30 Tagen entfernt.' },
      { q: 'Ist FilamentOS DSGVO-konform?', a: 'Ja. FilamentOS erfullt DSGVO und verwandte Datenschutzanforderungen.' },
    ],
  },
  {
    category: 'Haufige Probleme',
    icon: '⚠️',
    questions: [
      { q: '3MF-Analyse extrahiert Daten nicht korrekt', a: 'Prufe, ob es eine geslicte .gcode.3mf ist und nicht die originale Design-3MF. Bei Bedarf manuell eintragen und Support kontaktieren.' },
      { q: 'Ich kann mich nicht mit Google anmelden', a: 'Internet und Cookie-Einstellungen prufen. In iOS/Safari "Alle Cookies blockieren" deaktivieren. Notfalls privaten Modus testen.' },
      { q: 'Die App ladt auf dem Handy nicht', a: 'FilamentOS funktioniert am besten mit Chrome (Android) und Safari (iOS). Cache leeren oder PWA neu installieren.' },
      { q: 'Wie melde ich einen Bug?', a: 'Schreibe an luprintech@gmail.com mit Browser und Reproduktionsschritten oder erstelle ein Issue unter github.com/Luprintech/filamentOS.' },
    ],
  },
  {
    category: 'Als App installieren',
    icon: '📱',
    questions: [
      { q: 'Kann ich FilamentOS als App installieren?', a: 'Ja. FilamentOS ist eine PWA und kann auf Mobilgeraten wie eine native App installiert werden.' },
      { q: 'Wie installiere ich FilamentOS auf Android?', a: 'In Chrome auf Android: FilamentOS offnen, Menu (⋮), "Zum Startbildschirm hinzufugen" oder "App installieren" wahlen und bestatigen.' },
      { q: 'Wie installiere ich FilamentOS auf iPhone/iPad?', a: 'In Safari auf iOS: FilamentOS offnen, Teilen antippen, "Zum Home-Bildschirm" wahlen und bestatigen.' },
      { q: 'Welche Vorteile hat die Installation als App?', a: 'Startbildschirm-Shortcut, Vollbildmodus, Offline-Cache und schneller Zugriff.' },
    ],
  },
  {
    category: 'Kommende Funktionen',
    icon: '✨',
    questions: [
      { q: 'Was ist Echtzeit-Druckeruberwachung?', a: 'Geplante Funktion zum Verbinden von Druckern (Bambu Lab, OctoPrint, Klipper) fur Live-Status, Fortschritt, Temperaturen, Verbrauch und Restzeit.' },
      { q: 'Welche Drucker werden unterstutzt?', a: 'Geplant sind Bambu Lab uber MQTT sowie OctoPrint/Klipper-Moonraker uber Echtzeit-APIs.' },
      { q: 'Was ist der Filament-Vergleicher?', a: 'Tool zum Vergleich von 2-4 Filamenten nach Kosten, Bestand und Eigenschaften, um das beste Material zu wahlen.' },
      { q: 'Was ist der offentliche Projekt-Feed?', a: 'Community-Bereich zum optionalen Teilen offentlicher Projekte mit Filtern, Referenzen und wiederverwendbaren Vorlagen.' },
    ],
  },
];

const it: FAQCategory[] = [
  {
    category: 'Primi passi',
    icon: '🚀',
    questions: [
      { q: 'Che cos e FilamentOS?', a: 'FilamentOS e il tuo sistema operativo per la stampa 3D. Puoi calcolare costi reali, gestire bobine, tracciare progetti e vedere statistiche in un unico posto.' },
      { q: 'Serve un account per usarlo?', a: 'Non e obbligatorio. Puoi usare calcolatrice e PDF senza account. Per salvare progetti e usare tracker/statistiche serve un account Google gratuito.' },
      { q: 'E gratuito?', a: 'Si. FilamentOS e completamente gratuito.' },
      { q: 'Posso installarlo sul telefono?', a: 'Si. FilamentOS e una PWA. Su Android/Chrome: menu -> Aggiungi a schermata Home. Su iOS/Safari: Condividi -> Aggiungi a Home.' },
    ],
  },
  {
    category: 'Calcolatrice costi',
    icon: '🧮',
    questions: [
      { q: 'Come calcolo il costo di una stampa?', a: 'Vai alla calcolatrice e completa 4 passaggi: dettagli, filamento/energia, manodopera/ammortamento, prezzo finale con margine/tasse. Puoi anche caricare G-code o 3MF.' },
      { q: 'Posso salvare un progetto calcolato?', a: 'Si. Clicca Salva progetto a fine calcolo. Devi essere autenticato. Poi puoi ricaricarlo da Progetti salvati.' },
      { q: 'Come genero un preventivo PDF?', a: 'Dopo il calcolo, clicca Genera PDF. Puoi personalizzare logo, nome azienda e colori prima del download.' },
    ],
  },
  {
    category: 'File 3MF e G-code',
    icon: '📁',
    questions: [
      { q: 'Che tipo di file 3MF mi serve?', a: 'Usa un 3MF slicato, di solito .gcode.3mf. Contiene metadati di stampa per estrarre tempo e peso.' },
      { q: 'Come esporto il 3MF corretto da Bambu Studio?', a: 'In Bambu Studio: apri il modello, fai lo slice, poi File -> Export -> Export plate as sliced 3MF. Carica il file .gcode.3mf.' , showBambuGif: true },
      { q: 'Come esporto il 3MF corretto da OrcaSlicer?', a: 'In OrcaSlicer: configura il modello, clicca Slice, poi File -> Export -> Export as sliced 3MF e carica il .gcode.3mf generato.' },
      { q: 'Perche il 3MF originale di MakerWorld non funziona?', a: 'Quelli sono file di design, non file di stampa slicati. Aprili nel slicer, configura e esporta un 3MF slicato.' },
      { q: 'Quali dati estrae automaticamente FilamentOS dal 3MF?', a: 'Nome progetto, piastre di stampa, peso per piastra e totale, tempo stimato e, quando disponibile, tipo/colore filamento.' },
      { q: 'Posso caricare G-code direttamente?', a: 'Si. FilamentOS accetta file .gcode e .gcode.3mf.' },
    ],
  },
  {
    category: 'Inventario bobine',
    icon: '🧵',
    questions: [
      { q: 'Come aggiungo una bobina all inventario?', a: 'Vai in Inventario e clicca + Aggiungi bobina. Inserisci marca, materiale, colore, peso e prezzo. Puoi anche scansionare l etichetta.' },
      { q: 'Come scarico filamento da una bobina?', a: 'Quando salvi un progetto, FilamentOS chiede la bobina usata e scala i grammi automaticamente. Puoi anche farlo manualmente.' },
      { q: 'Cosa significa la percentuale della bobina?', a: 'E la percentuale rimanente rispetto al peso originale. Lo stock basso appare negli avvisi dedicati.' },
    ],
  },
  {
    category: 'Tracker progetti',
    icon: '📊',
    questions: [
      { q: 'Cos e il tracker progetti?', a: 'Ti permette di gestire progetti di produzione: serie, challenge o ordini cliente. Ogni progetto traccia avanzamento, costo, filamento e tempo.' },
      { q: 'Posso tracciare una challenge di 30 giorni?', a: 'Si. Crea un progetto, imposta il totale pezzi e registra ogni pezzo completato. FilamentOS aggiorna i totali automaticamente.' },
    ],
  },
  {
    category: 'Statistiche',
    icon: '📈',
    questions: [
      { q: 'Cosa mostrano le statistiche?', a: 'Pezzi stampati, consumo filamento, costo totale, tempo stampa, trend attivita e costo per progetto con filtri data.' },
      { q: 'Posso esportare le statistiche?', a: 'Si. Esportazione CSV per trend temporale e per dettaglio progetto.' },
    ],
  },
  {
    category: 'Account e privacy',
    icon: '🔒',
    questions: [
      { q: 'Quali dati salva FilamentOS?', a: 'Solo i dati inseriti da te: progetti, bobine, statistiche e impostazioni account. Nessun cookie di tracking/pubblicita.' },
      { q: 'Posso eliminare il mio account?', a: 'Si. Scrivi a luprintech@gmail.com dall email dell account e i dati verranno rimossi entro 30 giorni.' },
      { q: 'FilamentOS e conforme al GDPR?', a: 'Si. FilamentOS rispetta GDPR e requisiti privacy correlati.' },
    ],
  },
  {
    category: 'Problemi comuni',
    icon: '⚠️',
    questions: [
      { q: 'L analisi 3MF non estrae i dati correttamente', a: 'Verifica che sia un file .gcode.3mf slicato e non il 3MF di design originale. Se serve, inserisci i dati manualmente e contatta il supporto.' },
      { q: 'Non riesco ad accedere con Google', a: 'Controlla connessione e cookie. In iOS/Safari disattiva "Block all cookies". Se necessario prova la modalita privata.' },
      { q: 'L app non si carica sul telefono', a: 'FilamentOS funziona meglio con Chrome (Android) e Safari (iOS). Prova a pulire la cache o reinstallare la PWA.' },
      { q: 'Come segnalo un bug?', a: 'Scrivi a luprintech@gmail.com con browser e passi di riproduzione, oppure apri una issue su github.com/Luprintech/filamentOS.' },
    ],
  },
  {
    category: 'Installa come app',
    icon: '📱',
    questions: [
      { q: 'Posso installare FilamentOS come app?', a: 'Si. FilamentOS e una PWA installabile su mobile/tablet come app nativa.' },
      { q: 'Come installo FilamentOS su Android?', a: 'In Chrome Android: apri FilamentOS, tocca menu (⋮), scegli "Add to Home screen" o "Install app" e conferma.' },
      { q: 'Come installo FilamentOS su iPhone/iPad?', a: 'In Safari iOS: apri FilamentOS, tocca Condividi, scegli "Add to Home Screen" e conferma.' },
      { q: 'Quali vantaggi ci sono a installarlo come app?', a: 'Scorciatoia in home, modalita schermo intero, cache offline e accesso piu rapido.' },
    ],
  },
  {
    category: 'Funzionalita in arrivo',
    icon: '✨',
    questions: [
      { q: 'Cos e il monitoraggio stampante in tempo reale?', a: 'Funzione in arrivo per collegare stampanti (Bambu Lab, OctoPrint, Klipper) e vedere stato live, avanzamento, temperature, consumo e tempo restante.' },
      { q: 'Quali stampanti saranno compatibili?', a: 'Supporto previsto per Bambu Lab via MQTT e OctoPrint/Klipper-Moonraker via API realtime.' },
      { q: 'Cos e il comparatore filamenti?', a: 'Strumento per confrontare 2-4 filamenti per costo, stock e proprieta e scegliere il migliore per ogni stampa.' },
      { q: 'Cos e il feed di progetti pubblici?', a: 'Sezione community per condividere progetti pubblici opzionali con filtri, riferimenti e template riutilizzabili.' },
    ],
  },
];

const byLanguage: Record<FaqLanguage, FAQCategory[]> = {
  es,
  en,
  pt,
  fr,
  de,
  it,
};

export function getFaqsForLanguage(language: string): FAQCategory[] {
  const short = language.toLowerCase().split('-')[0] as FaqLanguage;
  return byLanguage[short] ?? byLanguage.es;
}
