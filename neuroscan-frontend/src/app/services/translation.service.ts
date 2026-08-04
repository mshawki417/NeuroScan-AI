import { Injectable, signal } from '@angular/core';

export interface Translations {
  // Navbar
  nav_product: string; nav_features: string; nav_solutions: string;
  nav_pricing: string; nav_enterprise: string; nav_login: string;
  nav_demo: string; nav_search_placeholder: string;
  // Dropdown – Product
  dd_proj_mgmt_title: string; dd_proj_planning: string; dd_task_mgmt: string;
  dd_milestone: string; dd_resource: string; dd_collab_title: string;
  dd_team_dash: string; dd_doc_sharing: string; dd_realtime: string;
  dd_mobile: string; dd_integrations_title: string; dd_erp: string;
  dd_bim: string; dd_accounting: string; dd_explore_all: string;
  // Dropdown – Features
  dd_precon_title: string; dd_tender: string; dd_bim_int: string;
  dd_estimating: string; dd_const_title: string; dd_proj_mgmt2: string;
  dd_quality: string; dd_schedule: string; dd_rfi: string;
  dd_fin_title: string; dd_budget: string; dd_invoice: string;
  dd_proj_fin: string; dd_time_track: string; dd_platform_title: string;
  dd_analytics: string; dd_doc_mgmt: string; dd_view_more: string;
  // Dropdown – Solutions
  dd_by_role_title: string; dd_pm: string; dd_site_eng: string;
  dd_cfo: string; dd_subcon: string; dd_by_sector_title: string;
  dd_commercial: string; dd_infra: string; dd_residential: string;
  dd_industrial: string; dd_by_size_title: string; dd_small: string;
  dd_mid: string; dd_enterprise: string; dd_see_all: string;
  // Hero
  hero_badge: string; hero_headline_1: string; hero_headline_2: string;
  hero_sub: string; hero_cta_primary: string; hero_cta_outline: string;
  // Trusted
  trusted_label: string;
  // Features
  feat_label: string; feat_title: string; feat_subtitle: string; feat_learn_more: string;
  feat_0_title: string; feat_0_desc: string; feat_1_title: string; feat_1_desc: string;
  feat_2_title: string; feat_2_desc: string; feat_3_title: string; feat_3_desc: string;
  feat_4_title: string; feat_4_desc: string; feat_5_title: string; feat_5_desc: string;
  // Pricing
  pricing_label: string; pricing_title: string; pricing_subtitle: string;
  pricing_coming_soon: string; pricing_monthly: string; pricing_annual: string; pricing_save: string;
  // Testimonials
  test_label: string; test_title: string; test_subtitle: string; test_coming_soon: string;
  // FAQ
  faq_label: string; faq_title: string; faq_subtitle: string; faq_contact: string;
  faq_coming_soon: string; faq_support_247: string; faq_support_label: string;
  faq_response: string; faq_response_label: string;
  // Footer
  footer_cta_heading: string; footer_cta_sub: string; footer_cta_btn: string;
  footer_cta_demo: string; footer_tagline: string;
  footer_col_product: string; footer_col_company: string; footer_col_support: string;
  footer_link_dashboard: string; footer_link_scheduling: string; footer_link_budget: string;
  footer_link_field: string; footer_link_mobile: string; footer_link_about: string;
  footer_link_careers: string; footer_link_blog: string; footer_link_press: string;
  footer_link_partners: string; footer_link_help: string; footer_link_contact: string;
  footer_link_status: string; footer_link_privacy: string; footer_link_terms: string;
  footer_copyright: string; footer_bottom_privacy: string; footer_bottom_terms: string;
  footer_bottom_cookies: string;
}

// ─── English (base) ─────────────────────────────────────────────────────────
const EN: Translations = {
  nav_product: 'Product', nav_features: 'Features', nav_solutions: 'Solutions',
  nav_pricing: 'Pricing', nav_enterprise: 'Enterprise', nav_login: 'Login',
  nav_demo: 'Get a Free Demo', nav_search_placeholder: 'Search…',
  dd_proj_mgmt_title: 'Project Management', dd_proj_planning: 'Project Planning',
  dd_task_mgmt: 'Task Management', dd_milestone: 'Milestone Tracking',
  dd_resource: 'Resource Allocation', dd_collab_title: 'Collaboration',
  dd_team_dash: 'Team Dashboards', dd_doc_sharing: 'Document Sharing',
  dd_realtime: 'Real-Time Updates', dd_mobile: 'Mobile Access',
  dd_integrations_title: 'Integrations', dd_erp: 'ERP Systems',
  dd_bim: 'BIM Tools', dd_accounting: 'Accounting Software',
  dd_explore_all: 'Explore all product features',
  dd_precon_title: 'Preconstruction', dd_tender: 'Tender Management',
  dd_bim_int: 'BIM Integration', dd_estimating: 'Estimating',
  dd_const_title: 'Construction', dd_proj_mgmt2: 'Project Management',
  dd_quality: 'Quality & Safety', dd_schedule: 'Schedule', dd_rfi: 'RFI',
  dd_fin_title: 'Financials', dd_budget: 'Budget Management',
  dd_invoice: 'Invoice Management', dd_proj_fin: 'Project Financials',
  dd_time_track: 'Time Tracking', dd_platform_title: 'Platform',
  dd_analytics: 'Analytics', dd_doc_mgmt: 'Document Management',
  dd_view_more: 'View more capabilities',
  dd_by_role_title: 'By Role', dd_pm: 'Project Managers',
  dd_site_eng: 'Site Engineers', dd_cfo: 'Financial Officers',
  dd_subcon: 'Subcontractors', dd_by_sector_title: 'By Sector',
  dd_commercial: 'Commercial', dd_infra: 'Infrastructure',
  dd_residential: 'Residential', dd_industrial: 'Industrial',
  dd_by_size_title: 'By Size', dd_small: 'Small Teams',
  dd_mid: 'Mid-Market', dd_enterprise: 'Enterprise', dd_see_all: 'See all solutions',
  hero_badge: 'Construction Management Software',
  hero_headline_1: 'Streamline Construction.',
  hero_headline_2: 'Deliver Projects Faster.',
  hero_sub: 'Easo-Manage is the intelligent platform that connects your teams, projects, and data in one place — so you can build with confidence.',
  hero_cta_primary: 'Get Started Now', hero_cta_outline: 'Request a Custom Demo',
  trusted_label: 'Trusted by Industry Leaders',
  feat_label: 'Feature Highlights',
  feat_title: 'Everything You Need to Manage Construction Projects',
  feat_subtitle: 'From planning to delivery, Easo-Manage gives your team the tools to work smarter, stay aligned, and deliver on time.',
  feat_learn_more: 'Learn more',
  feat_0_title: 'Centralized Dashboard',
  feat_0_desc: 'Visual data and task monitoring in one place. Track project KPIs, budgets, and team progress at a glance.',
  feat_1_title: 'Dynamic Scheduling',
  feat_1_desc: 'Gantt charts and smart resource allocation. Drag-and-drop timelines keep every project on track.',
  feat_2_title: 'Site Visibility',
  feat_2_desc: 'Real-time field reporting and photo uploads. Stay connected to every job site from your desk.',
  feat_3_title: 'Budget Tracking',
  feat_3_desc: 'Live cost monitoring with variance alerts. Prevent overruns before they happen.',
  feat_4_title: 'Team Collaboration',
  feat_4_desc: 'Multi-user access with role-based permissions. Everyone sees exactly what they need, nothing more.',
  feat_5_title: 'Document Management',
  feat_5_desc: 'Centralized file storage with version control. Find any document instantly — never lose critical files again.',
  pricing_label: 'Pricing', pricing_title: 'Simple, Transparent Pricing',
  pricing_subtitle: 'No hidden fees. No surprises. Choose the plan that fits your team and scale up as you grow.',
  pricing_coming_soon: 'Pricing plans coming soon.',
  pricing_monthly: 'Monthly', pricing_annual: 'Annual', pricing_save: 'Save 20%',
  test_label: 'Testimonials',
  test_title: 'Trusted by Construction Leaders Around the World',
  test_subtitle: 'See how Easo-Manage helps teams deliver projects on time, on budget, and with complete visibility.',
  test_coming_soon: 'Customer testimonials coming soon.',
  faq_label: 'FAQ', faq_title: 'Frequently Asked Questions',
  faq_subtitle: "Can't find what you're looking for?",
  faq_contact: 'Contact our support team.',
  faq_coming_soon: 'FAQ content coming soon.',
  faq_support_247: '24/7', faq_support_label: 'Support',
  faq_response: '< 2h', faq_response_label: 'Avg. response',
  footer_cta_heading: 'Ready to Build Smarter?',
  footer_cta_sub: 'Start your 14-day free trial today. No credit card required.',
  footer_cta_btn: "Get Started — It's Free", footer_cta_demo: 'Book a Live Demo',
  footer_tagline: 'The intelligent platform for modern construction project management, budgeting, and real-time team collaboration.',
  footer_col_product: 'Product', footer_col_company: 'Company', footer_col_support: 'Support',
  footer_link_dashboard: 'Dashboard', footer_link_scheduling: 'Scheduling',
  footer_link_budget: 'Budget Tracker', footer_link_field: 'Field Reports',
  footer_link_mobile: 'Mobile App', footer_link_about: 'About Us',
  footer_link_careers: 'Careers', footer_link_blog: 'Blog', footer_link_press: 'Press',
  footer_link_partners: 'Partners', footer_link_help: 'Help Center',
  footer_link_contact: 'Contact Us', footer_link_status: 'System Status',
  footer_link_privacy: 'Privacy Policy', footer_link_terms: 'Terms of Service',
  footer_copyright: 'Easo-Manage. All rights reserved.',
  footer_bottom_privacy: 'Privacy Policy', footer_bottom_terms: 'Terms of Service',
  footer_bottom_cookies: 'Cookie Policy',
};

// ─── Arabic / العربية ────────────────────────────────────────────────────────
const AR: Translations = {
  nav_product: 'المنتج', nav_features: 'المميزات', nav_solutions: 'الحلول',
  nav_pricing: 'الأسعار', nav_enterprise: 'للشركات', nav_login: 'تسجيل الدخول',
  nav_demo: 'احصل على عرض مجاني', nav_search_placeholder: 'بحث…',
  dd_proj_mgmt_title: 'إدارة المشاريع', dd_proj_planning: 'تخطيط المشاريع',
  dd_task_mgmt: 'إدارة المهام', dd_milestone: 'تتبع المعالم',
  dd_resource: 'تخصيص الموارد', dd_collab_title: 'التعاون',
  dd_team_dash: 'لوحات الفريق', dd_doc_sharing: 'مشاركة الوثائق',
  dd_realtime: 'تحديثات فورية', dd_mobile: 'الوصول عبر الهاتف',
  dd_integrations_title: 'التكاملات', dd_erp: 'أنظمة ERP',
  dd_bim: 'أدوات BIM', dd_accounting: 'برامج المحاسبة',
  dd_explore_all: 'استكشف جميع ميزات المنتج',
  dd_precon_title: 'ما قبل الإنشاء', dd_tender: 'إدارة المناقصات',
  dd_bim_int: 'تكامل BIM', dd_estimating: 'التقدير',
  dd_const_title: 'الإنشاء', dd_proj_mgmt2: 'إدارة المشاريع',
  dd_quality: 'الجودة والسلامة', dd_schedule: 'الجدول الزمني', dd_rfi: 'طلبات المعلومات',
  dd_fin_title: 'الشؤون المالية', dd_budget: 'إدارة الميزانية',
  dd_invoice: 'إدارة الفواتير', dd_proj_fin: 'الشؤون المالية للمشروع',
  dd_time_track: 'تتبع الوقت', dd_platform_title: 'المنصة',
  dd_analytics: 'التحليلات', dd_doc_mgmt: 'إدارة الوثائق',
  dd_view_more: 'عرض المزيد من الإمكانيات',
  dd_by_role_title: 'حسب الدور', dd_pm: 'مديرو المشاريع',
  dd_site_eng: 'مهندسو الموقع', dd_cfo: 'المسؤولون الماليون',
  dd_subcon: 'المقاولون من الباطن', dd_by_sector_title: 'حسب القطاع',
  dd_commercial: 'تجاري', dd_infra: 'البنية التحتية',
  dd_residential: 'سكني', dd_industrial: 'صناعي',
  dd_by_size_title: 'حسب الحجم', dd_small: 'الفرق الصغيرة',
  dd_mid: 'السوق المتوسط', dd_enterprise: 'المؤسسات الكبرى', dd_see_all: 'عرض جميع الحلول',
  hero_badge: 'برنامج إدارة مشاريع الإنشاءات',
  hero_headline_1: 'بسّط عمليات الإنشاء.',
  hero_headline_2: 'سلّم المشاريع بشكل أسرع.',
  hero_sub: 'إيزو-مانيج هي المنصة الذكية التي تربط فرقك ومشاريعك وبياناتك في مكان واحد — لتبني بثقة.',
  hero_cta_primary: 'ابدأ الآن', hero_cta_outline: 'اطلب عرضاً مخصصاً',
  trusted_label: 'موثوق به من قادة الصناعة',
  feat_label: 'أبرز المميزات',
  feat_title: 'كل ما تحتاجه لإدارة مشاريع الإنشاءات',
  feat_subtitle: 'من التخطيط إلى التسليم، توفر إيزو-مانيج لفريقك الأدوات للعمل بذكاء والتسليم في الوقت المحدد.',
  feat_learn_more: 'اعرف المزيد',
  feat_0_title: 'لوحة تحكم مركزية',
  feat_0_desc: 'مراقبة البيانات والمهام بصرياً في مكان واحد. تتبع مؤشرات الأداء والميزانيات وتقدم الفريق بلمحة.',
  feat_1_title: 'جدولة ديناميكية',
  feat_1_desc: 'مخططات جانت وتخصيص ذكي للموارد. الجداول الزمنية القابلة للسحب والإفلات تبقي كل مشروع في مساره.',
  feat_2_title: 'رؤية الموقع',
  feat_2_desc: 'تقارير ميدانية فورية ورفع صور. ابق متصلاً بكل موقع عمل من مكتبك.',
  feat_3_title: 'تتبع الميزانية',
  feat_3_desc: 'مراقبة حية للتكاليف مع تنبيهات الانحراف. امنع التجاوزات قبل أن تحدث.',
  feat_4_title: 'تعاون الفريق',
  feat_4_desc: 'وصول متعدد المستخدمين مع صلاحيات حسب الأدوار. يرى كل شخص ما يحتاجه تماماً، لا أكثر.',
  feat_5_title: 'إدارة الوثائق',
  feat_5_desc: 'تخزين مركزي للملفات مع التحكم في الإصدارات. ابحث عن أي وثيقة فوراً — لا تفقد الملفات الحيوية أبداً.',
  pricing_label: 'الأسعار', pricing_title: 'تسعير بسيط وشفاف',
  pricing_subtitle: 'لا رسوم خفية. لا مفاجآت. اختر الخطة التي تناسب فريقك وتوسع مع نموك.',
  pricing_coming_soon: 'خطط الأسعار قادمة قريباً.',
  pricing_monthly: 'شهري', pricing_annual: 'سنوي', pricing_save: 'وفر 20%',
  test_label: 'آراء العملاء',
  test_title: 'موثوق به من قادة الإنشاءات حول العالم',
  test_subtitle: 'اكتشف كيف تساعد إيزو-مانيج الفرق على تسليم المشاريع في الوقت المحدد وبالميزانية المحددة.',
  test_coming_soon: 'آراء العملاء قادمة قريباً.',
  faq_label: 'الأسئلة الشائعة', faq_title: 'الأسئلة الأكثر شيوعاً',
  faq_subtitle: 'لم تجد ما تبحث عنه؟', faq_contact: 'تواصل مع فريق الدعم.',
  faq_coming_soon: 'محتوى الأسئلة الشائعة قادم قريباً.',
  faq_support_247: '24/7', faq_support_label: 'دعم',
  faq_response: '< 2 ساعة', faq_response_label: 'متوسط الرد',
  footer_cta_heading: 'هل أنت مستعد للبناء بذكاء؟',
  footer_cta_sub: 'ابدأ تجربتك المجانية لمدة 14 يوماً اليوم. لا بطاقة ائتمان مطلوبة.',
  footer_cta_btn: 'ابدأ الآن — مجاناً', footer_cta_demo: 'احجز عرضاً مباشراً',
  footer_tagline: 'المنصة الذكية لإدارة مشاريع الإنشاءات الحديثة والميزانيات والتعاون الفوري للفرق.',
  footer_col_product: 'المنتج', footer_col_company: 'الشركة', footer_col_support: 'الدعم',
  footer_link_dashboard: 'لوحة التحكم', footer_link_scheduling: 'الجدولة',
  footer_link_budget: 'تتبع الميزانية', footer_link_field: 'التقارير الميدانية',
  footer_link_mobile: 'تطبيق الهاتف', footer_link_about: 'من نحن',
  footer_link_careers: 'الوظائف', footer_link_blog: 'المدونة', footer_link_press: 'الصحافة',
  footer_link_partners: 'الشركاء', footer_link_help: 'مركز المساعدة',
  footer_link_contact: 'اتصل بنا', footer_link_status: 'حالة النظام',
  footer_link_privacy: 'سياسة الخصوصية', footer_link_terms: 'شروط الخدمة',
  footer_copyright: 'إيزو-مانيج. جميع الحقوق محفوظة.',
  footer_bottom_privacy: 'سياسة الخصوصية', footer_bottom_terms: 'شروط الخدمة',
  footer_bottom_cookies: 'سياسة ملفات تعريف الارتباط',
};

// ─── Spanish / Español ───────────────────────────────────────────────────────
const ES: Translations = {
  nav_product: 'Producto', nav_features: 'Funciones', nav_solutions: 'Soluciones',
  nav_pricing: 'Precios', nav_enterprise: 'Empresas', nav_login: 'Iniciar sesión',
  nav_demo: 'Obtener demo gratis', nav_search_placeholder: 'Buscar…',
  dd_proj_mgmt_title: 'Gestión de proyectos', dd_proj_planning: 'Planificación de proyectos',
  dd_task_mgmt: 'Gestión de tareas', dd_milestone: 'Seguimiento de hitos',
  dd_resource: 'Asignación de recursos', dd_collab_title: 'Colaboración',
  dd_team_dash: 'Paneles del equipo', dd_doc_sharing: 'Compartir documentos',
  dd_realtime: 'Actualizaciones en tiempo real', dd_mobile: 'Acceso móvil',
  dd_integrations_title: 'Integraciones', dd_erp: 'Sistemas ERP',
  dd_bim: 'Herramientas BIM', dd_accounting: 'Software de contabilidad',
  dd_explore_all: 'Explorar todas las funciones del producto',
  dd_precon_title: 'Preconstrucción', dd_tender: 'Gestión de licitaciones',
  dd_bim_int: 'Integración BIM', dd_estimating: 'Presupuestación',
  dd_const_title: 'Construcción', dd_proj_mgmt2: 'Gestión de proyectos',
  dd_quality: 'Calidad y seguridad', dd_schedule: 'Cronograma', dd_rfi: 'RFI',
  dd_fin_title: 'Finanzas', dd_budget: 'Gestión de presupuesto',
  dd_invoice: 'Gestión de facturas', dd_proj_fin: 'Finanzas del proyecto',
  dd_time_track: 'Seguimiento del tiempo', dd_platform_title: 'Plataforma',
  dd_analytics: 'Analíticas', dd_doc_mgmt: 'Gestión de documentos',
  dd_view_more: 'Ver más capacidades',
  dd_by_role_title: 'Por rol', dd_pm: 'Directores de proyecto',
  dd_site_eng: 'Ingenieros de campo', dd_cfo: 'Directores financieros',
  dd_subcon: 'Subcontratistas', dd_by_sector_title: 'Por sector',
  dd_commercial: 'Comercial', dd_infra: 'Infraestructura',
  dd_residential: 'Residencial', dd_industrial: 'Industrial',
  dd_by_size_title: 'Por tamaño', dd_small: 'Equipos pequeños',
  dd_mid: 'Mercado medio', dd_enterprise: 'Empresas grandes', dd_see_all: 'Ver todas las soluciones',
  hero_badge: 'Software de gestión de obras',
  hero_headline_1: 'Optimiza la construcción.',
  hero_headline_2: 'Entrega proyectos más rápido.',
  hero_sub: 'Easo-Manage es la plataforma inteligente que conecta tus equipos, proyectos y datos en un solo lugar — para construir con confianza.',
  hero_cta_primary: 'Comenzar ahora', hero_cta_outline: 'Solicitar demo personalizada',
  trusted_label: 'Con la confianza de líderes del sector',
  feat_label: 'Funciones destacadas',
  feat_title: 'Todo lo que necesitas para gestionar proyectos de construcción',
  feat_subtitle: 'Desde la planificación hasta la entrega, Easo-Manage da a tu equipo las herramientas para trabajar con más inteligencia.',
  feat_learn_more: 'Saber más',
  feat_0_title: 'Panel centralizado',
  feat_0_desc: 'Datos y tareas visuales en un solo lugar. Sigue KPIs, presupuestos y el progreso del equipo de un vistazo.',
  feat_1_title: 'Programación dinámica',
  feat_1_desc: 'Diagramas de Gantt y asignación inteligente de recursos. Cronogramas drag-and-drop para mantener el rumbo.',
  feat_2_title: 'Visibilidad del sitio',
  feat_2_desc: 'Informes de campo en tiempo real y carga de fotos. Mantente conectado a cada obra desde tu escritorio.',
  feat_3_title: 'Control presupuestario',
  feat_3_desc: 'Monitoreo de costes en vivo con alertas de desviación. Previene sobrecostes antes de que ocurran.',
  feat_4_title: 'Colaboración de equipo',
  feat_4_desc: 'Acceso multiusuario con permisos por rol. Cada persona ve exactamente lo que necesita.',
  feat_5_title: 'Gestión documental',
  feat_5_desc: 'Almacenamiento centralizado con control de versiones. Encuentra cualquier documento al instante.',
  pricing_label: 'Precios', pricing_title: 'Precios simples y transparentes',
  pricing_subtitle: 'Sin tarifas ocultas. Sin sorpresas. Elige el plan que mejor se adapte a tu equipo.',
  pricing_coming_soon: 'Planes de precios próximamente.',
  pricing_monthly: 'Mensual', pricing_annual: 'Anual', pricing_save: 'Ahorra 20%',
  test_label: 'Testimonios',
  test_title: 'Con la confianza de líderes de la construcción en todo el mundo',
  test_subtitle: 'Descubre cómo Easo-Manage ayuda a los equipos a entregar proyectos a tiempo y dentro del presupuesto.',
  test_coming_soon: 'Testimonios de clientes próximamente.',
  faq_label: 'FAQ', faq_title: 'Preguntas frecuentes',
  faq_subtitle: '¿No encuentras lo que buscas?', faq_contact: 'Contacta con nuestro equipo de soporte.',
  faq_coming_soon: 'Contenido FAQ próximamente.',
  faq_support_247: '24/7', faq_support_label: 'Soporte',
  faq_response: '< 2h', faq_response_label: 'Respuesta media',
  footer_cta_heading: '¿Listo para construir más inteligente?',
  footer_cta_sub: 'Empieza tu prueba gratuita de 14 días hoy. Sin tarjeta de crédito.',
  footer_cta_btn: 'Comenzar — Es gratis', footer_cta_demo: 'Reservar demo en vivo',
  footer_tagline: 'La plataforma inteligente para la gestión moderna de proyectos de construcción.',
  footer_col_product: 'Producto', footer_col_company: 'Empresa', footer_col_support: 'Soporte',
  footer_link_dashboard: 'Panel', footer_link_scheduling: 'Programación',
  footer_link_budget: 'Control presupuestario', footer_link_field: 'Informes de campo',
  footer_link_mobile: 'App móvil', footer_link_about: 'Sobre nosotros',
  footer_link_careers: 'Empleo', footer_link_blog: 'Blog', footer_link_press: 'Prensa',
  footer_link_partners: 'Socios', footer_link_help: 'Centro de ayuda',
  footer_link_contact: 'Contáctanos', footer_link_status: 'Estado del sistema',
  footer_link_privacy: 'Política de privacidad', footer_link_terms: 'Condiciones de servicio',
  footer_copyright: 'Easo-Manage. Todos los derechos reservados.',
  footer_bottom_privacy: 'Política de privacidad', footer_bottom_terms: 'Condiciones de servicio',
  footer_bottom_cookies: 'Política de cookies',
};

// ─── German / Deutsch ────────────────────────────────────────────────────────
const DE: Translations = {
  nav_product: 'Produkt', nav_features: 'Funktionen', nav_solutions: 'Lösungen',
  nav_pricing: 'Preise', nav_enterprise: 'Enterprise', nav_login: 'Anmelden',
  nav_demo: 'Kostenlose Demo', nav_search_placeholder: 'Suchen…',
  dd_proj_mgmt_title: 'Projektmanagement', dd_proj_planning: 'Projektplanung',
  dd_task_mgmt: 'Aufgabenverwaltung', dd_milestone: 'Meilenstein-Tracking',
  dd_resource: 'Ressourcenzuteilung', dd_collab_title: 'Zusammenarbeit',
  dd_team_dash: 'Team-Dashboards', dd_doc_sharing: 'Dokumentenfreigabe',
  dd_realtime: 'Echtzeit-Updates', dd_mobile: 'Mobiler Zugriff',
  dd_integrations_title: 'Integrationen', dd_erp: 'ERP-Systeme',
  dd_bim: 'BIM-Tools', dd_accounting: 'Buchhaltungssoftware',
  dd_explore_all: 'Alle Produktfunktionen entdecken',
  dd_precon_title: 'Vorbauphase', dd_tender: 'Ausschreibungsmanagement',
  dd_bim_int: 'BIM-Integration', dd_estimating: 'Kostenschätzung',
  dd_const_title: 'Bauphase', dd_proj_mgmt2: 'Projektmanagement',
  dd_quality: 'Qualität & Sicherheit', dd_schedule: 'Zeitplan', dd_rfi: 'RFI',
  dd_fin_title: 'Finanzen', dd_budget: 'Budgetverwaltung',
  dd_invoice: 'Rechnungsverwaltung', dd_proj_fin: 'Projektfinanzen',
  dd_time_track: 'Zeiterfassung', dd_platform_title: 'Plattform',
  dd_analytics: 'Analysen', dd_doc_mgmt: 'Dokumentenmanagement',
  dd_view_more: 'Weitere Funktionen ansehen',
  dd_by_role_title: 'Nach Rolle', dd_pm: 'Projektmanager',
  dd_site_eng: 'Baustelleningenieure', dd_cfo: 'Finanzverantwortliche',
  dd_subcon: 'Subunternehmer', dd_by_sector_title: 'Nach Branche',
  dd_commercial: 'Gewerbe', dd_infra: 'Infrastruktur',
  dd_residential: 'Wohnbau', dd_industrial: 'Industrie',
  dd_by_size_title: 'Nach Größe', dd_small: 'Kleine Teams',
  dd_mid: 'Mittelstand', dd_enterprise: 'Großunternehmen', dd_see_all: 'Alle Lösungen ansehen',
  hero_badge: 'Baumanagementsoftware',
  hero_headline_1: 'Bauprozesse optimieren.',
  hero_headline_2: 'Projekte schneller abliefern.',
  hero_sub: 'Easo-Manage ist die intelligente Plattform, die Ihre Teams, Projekte und Daten an einem Ort verbindet — für sicheres Bauen.',
  hero_cta_primary: 'Jetzt starten', hero_cta_outline: 'Demo anfragen',
  trusted_label: 'Vertraut von Branchenführern',
  feat_label: 'Highlights',
  feat_title: 'Alles, was Sie für das Bauprojektmanagement brauchen',
  feat_subtitle: 'Von der Planung bis zur Lieferung gibt Easo-Manage Ihrem Team die Werkzeuge, um effizienter zu arbeiten.',
  feat_learn_more: 'Mehr erfahren',
  feat_0_title: 'Zentrales Dashboard',
  feat_0_desc: 'Visuelle Daten- und Aufgabenüberwachung an einem Ort. KPIs, Budgets und Teamfortschritt auf einen Blick.',
  feat_1_title: 'Dynamische Terminplanung',
  feat_1_desc: 'Gantt-Diagramme und intelligente Ressourcenzuweisung. Drag-and-Drop-Zeitpläne halten jedes Projekt auf Kurs.',
  feat_2_title: 'Baustellentransparenz',
  feat_2_desc: 'Echtzeit-Feldberichte und Foto-Uploads. Bleiben Sie von Ihrem Schreibtisch aus mit jeder Baustelle verbunden.',
  feat_3_title: 'Budgetkontrolle',
  feat_3_desc: 'Live-Kostenüberwachung mit Abweichungsalarmen. Verhindern Sie Überschreitungen bevor sie passieren.',
  feat_4_title: 'Team-Zusammenarbeit',
  feat_4_desc: 'Mehrbenutzer-Zugang mit rollenbasierten Berechtigungen. Jeder sieht genau, was er braucht.',
  feat_5_title: 'Dokumentenmanagement',
  feat_5_desc: 'Zentraler Dateispeicher mit Versionskontrolle. Finden Sie jedes Dokument sofort.',
  pricing_label: 'Preise', pricing_title: 'Einfache, transparente Preise',
  pricing_subtitle: 'Keine versteckten Gebühren. Keine Überraschungen. Wählen Sie den Plan, der zu Ihrem Team passt.',
  pricing_coming_soon: 'Preispläne demnächst verfügbar.',
  pricing_monthly: 'Monatlich', pricing_annual: 'Jährlich', pricing_save: '20% sparen',
  test_label: 'Referenzen',
  test_title: 'Von Bauführern weltweit vertraut',
  test_subtitle: 'Erfahren Sie, wie Easo-Manage Teams hilft, Projekte pünktlich und im Budget zu liefern.',
  test_coming_soon: 'Kundenbewertungen demnächst.',
  faq_label: 'FAQ', faq_title: 'Häufig gestellte Fragen',
  faq_subtitle: 'Nicht gefunden, was Sie suchen?', faq_contact: 'Kontaktieren Sie unser Support-Team.',
  faq_coming_soon: 'FAQ-Inhalte demnächst.',
  faq_support_247: '24/7', faq_support_label: 'Support',
  faq_response: '< 2h', faq_response_label: 'Ø Reaktionszeit',
  footer_cta_heading: 'Bereit, intelligenter zu bauen?',
  footer_cta_sub: 'Starten Sie heute Ihre 14-tägige kostenlose Testversion. Keine Kreditkarte erforderlich.',
  footer_cta_btn: 'Jetzt starten — kostenlos', footer_cta_demo: 'Live-Demo buchen',
  footer_tagline: 'Die intelligente Plattform für modernes Bauprojektmanagement, Budgetierung und Echtzeit-Zusammenarbeit.',
  footer_col_product: 'Produkt', footer_col_company: 'Unternehmen', footer_col_support: 'Support',
  footer_link_dashboard: 'Dashboard', footer_link_scheduling: 'Terminplanung',
  footer_link_budget: 'Budgetkontrolle', footer_link_field: 'Feldberichte',
  footer_link_mobile: 'Mobile App', footer_link_about: 'Über uns',
  footer_link_careers: 'Karriere', footer_link_blog: 'Blog', footer_link_press: 'Presse',
  footer_link_partners: 'Partner', footer_link_help: 'Hilfecenter',
  footer_link_contact: 'Kontakt', footer_link_status: 'Systemstatus',
  footer_link_privacy: 'Datenschutz', footer_link_terms: 'Nutzungsbedingungen',
  footer_copyright: 'Easo-Manage. Alle Rechte vorbehalten.',
  footer_bottom_privacy: 'Datenschutz', footer_bottom_terms: 'Nutzungsbedingungen',
  footer_bottom_cookies: 'Cookie-Richtlinie',
};

// ─── French / Français ───────────────────────────────────────────────────────
const FR: Translations = {
  nav_product: 'Produit', nav_features: 'Fonctionnalités', nav_solutions: 'Solutions',
  nav_pricing: 'Tarifs', nav_enterprise: 'Entreprise', nav_login: 'Se connecter',
  nav_demo: 'Obtenir une démo gratuite', nav_search_placeholder: 'Rechercher…',
  dd_proj_mgmt_title: 'Gestion de projet', dd_proj_planning: 'Planification de projet',
  dd_task_mgmt: 'Gestion des tâches', dd_milestone: 'Suivi des jalons',
  dd_resource: 'Allocation des ressources', dd_collab_title: 'Collaboration',
  dd_team_dash: "Tableaux de bord d'équipe", dd_doc_sharing: 'Partage de documents',
  dd_realtime: 'Mises à jour en temps réel', dd_mobile: 'Accès mobile',
  dd_integrations_title: 'Intégrations', dd_erp: 'Systèmes ERP',
  dd_bim: 'Outils BIM', dd_accounting: 'Logiciel de comptabilité',
  dd_explore_all: 'Explorer toutes les fonctionnalités du produit',
  dd_precon_title: 'Préconstruction', dd_tender: 'Gestion des appels d\'offres',
  dd_bim_int: 'Intégration BIM', dd_estimating: 'Estimation',
  dd_const_title: 'Construction', dd_proj_mgmt2: 'Gestion de projet',
  dd_quality: 'Qualité et sécurité', dd_schedule: 'Planning', dd_rfi: 'RFI',
  dd_fin_title: 'Finances', dd_budget: 'Gestion du budget',
  dd_invoice: 'Gestion des factures', dd_proj_fin: 'Finances du projet',
  dd_time_track: 'Suivi du temps', dd_platform_title: 'Plateforme',
  dd_analytics: 'Analytiques', dd_doc_mgmt: 'Gestion documentaire',
  dd_view_more: 'Voir plus de fonctionnalités',
  dd_by_role_title: 'Par rôle', dd_pm: 'Chefs de projet',
  dd_site_eng: 'Ingénieurs de chantier', dd_cfo: 'Directeurs financiers',
  dd_subcon: 'Sous-traitants', dd_by_sector_title: 'Par secteur',
  dd_commercial: 'Commercial', dd_infra: 'Infrastructure',
  dd_residential: 'Résidentiel', dd_industrial: 'Industriel',
  dd_by_size_title: 'Par taille', dd_small: 'Petites équipes',
  dd_mid: 'Marché intermédiaire', dd_enterprise: 'Grandes entreprises', dd_see_all: 'Voir toutes les solutions',
  hero_badge: 'Logiciel de gestion de chantier',
  hero_headline_1: 'Optimisez la construction.',
  hero_headline_2: 'Livrez vos projets plus vite.',
  hero_sub: 'Easo-Manage est la plateforme intelligente qui connecte vos équipes, projets et données en un seul endroit — pour construire en toute confiance.',
  hero_cta_primary: 'Commencer maintenant', hero_cta_outline: 'Demander une démo personnalisée',
  trusted_label: 'Approuvé par les leaders du secteur',
  feat_label: 'Points forts',
  feat_title: 'Tout ce dont vous avez besoin pour gérer vos projets de construction',
  feat_subtitle: 'De la planification à la livraison, Easo-Manage donne à votre équipe les outils pour travailler plus intelligemment.',
  feat_learn_more: 'En savoir plus',
  feat_0_title: 'Tableau de bord centralisé',
  feat_0_desc: 'Surveillance visuelle des données et des tâches. Suivez les KPIs, budgets et progrès en un coup d\'œil.',
  feat_1_title: 'Planification dynamique',
  feat_1_desc: 'Diagrammes de Gantt et allocation intelligente des ressources. Des plannings drag-and-drop pour rester dans les délais.',
  feat_2_title: 'Visibilité du chantier',
  feat_2_desc: 'Rapports de terrain en temps réel et téléchargement de photos. Restez connecté à chaque chantier depuis votre bureau.',
  feat_3_title: 'Suivi budgétaire',
  feat_3_desc: 'Surveillance des coûts en direct avec alertes d\'écart. Prévenez les dépassements avant qu\'ils ne surviennent.',
  feat_4_title: 'Collaboration d\'équipe',
  feat_4_desc: 'Accès multi-utilisateurs avec permissions par rôle. Chacun voit exactement ce dont il a besoin.',
  feat_5_title: 'Gestion documentaire',
  feat_5_desc: 'Stockage centralisé avec contrôle des versions. Trouvez n\'importe quel document instantanément.',
  pricing_label: 'Tarifs', pricing_title: 'Tarification simple et transparente',
  pricing_subtitle: 'Pas de frais cachés. Pas de surprises. Choisissez le plan adapté à votre équipe.',
  pricing_coming_soon: 'Plans tarifaires à venir.',
  pricing_monthly: 'Mensuel', pricing_annual: 'Annuel', pricing_save: 'Économisez 20%',
  test_label: 'Témoignages',
  test_title: 'Approuvé par les leaders de la construction dans le monde entier',
  test_subtitle: 'Découvrez comment Easo-Manage aide les équipes à livrer des projets dans les délais et le budget.',
  test_coming_soon: 'Témoignages clients à venir.',
  faq_label: 'FAQ', faq_title: 'Questions fréquentes',
  faq_subtitle: 'Vous ne trouvez pas ce que vous cherchez ?', faq_contact: 'Contactez notre équipe de support.',
  faq_coming_soon: 'Contenu FAQ à venir.',
  faq_support_247: '24h/24', faq_support_label: 'Support',
  faq_response: '< 2h', faq_response_label: 'Réponse moyenne',
  footer_cta_heading: 'Prêt à construire plus intelligemment ?',
  footer_cta_sub: 'Commencez votre essai gratuit de 14 jours aujourd\'hui. Sans carte de crédit.',
  footer_cta_btn: 'Commencer — C\'est gratuit', footer_cta_demo: 'Réserver une démo en direct',
  footer_tagline: 'La plateforme intelligente pour la gestion moderne des projets de construction, la budgétisation et la collaboration en temps réel.',
  footer_col_product: 'Produit', footer_col_company: 'Entreprise', footer_col_support: 'Support',
  footer_link_dashboard: 'Tableau de bord', footer_link_scheduling: 'Planification',
  footer_link_budget: 'Suivi budgétaire', footer_link_field: 'Rapports de terrain',
  footer_link_mobile: 'Application mobile', footer_link_about: 'À propos',
  footer_link_careers: 'Carrières', footer_link_blog: 'Blog', footer_link_press: 'Presse',
  footer_link_partners: 'Partenaires', footer_link_help: "Centre d'aide",
  footer_link_contact: 'Contactez-nous', footer_link_status: 'État du système',
  footer_link_privacy: 'Politique de confidentialité', footer_link_terms: "Conditions d'utilisation",
  footer_copyright: 'Easo-Manage. Tous droits réservés.',
  footer_bottom_privacy: 'Politique de confidentialité', footer_bottom_terms: "Conditions d'utilisation",
  footer_bottom_cookies: 'Politique de cookies',
};

// ─── Map ─────────────────────────────────────────────────────────────────────
const LANG_MAP: Record<string, Translations> = {
  'en': EN, 'en-US': EN, 'en-GB': EN, 'en-CA': EN, 'en-AU': EN, 'en-SG': EN,
  'ar': AR, 'ar-AE': AR, 'ar-EG': AR, 'ar-SA': AR,
  'es': ES, 'es-419': ES, 'es-ES': ES,
  'de': DE, 'de-DE': DE,
  'fr': FR, 'fr-FR': FR,
};

const RTL_CODES = ['ar', 'ar-AE', 'ar-EG', 'ar-SA'];

const FONT_MAP: Record<string, string> = {
  ar: "'Cairo', 'Segoe UI', sans-serif",
  de: "'Inter', 'Roboto', sans-serif",
  fr: "'Inter', 'Roboto', sans-serif",
  es: "'Inter', 'Roboto', sans-serif",
  en: "'Inter', 'Roboto', sans-serif",
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _langCode = signal<string>('en-US');
  readonly langCode = this._langCode.asReadonly();

  private readonly _translations = signal<Translations>(EN);
  readonly t = this._translations.asReadonly();

  setLang(code: string): void {
    this._langCode.set(code);
    const translations = LANG_MAP[code] ?? EN;
    this._translations.set(translations);

    const isRtl = RTL_CODES.includes(code);
    const baseLang = code.split('-')[0];
    const font = FONT_MAP[baseLang] ?? FONT_MAP['en'];

    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.body.style.fontFamily = font;
  }

  isRtl(): boolean {
    return RTL_CODES.includes(this._langCode());
  }
}
