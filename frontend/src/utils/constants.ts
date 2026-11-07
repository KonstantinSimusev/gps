export const ROLE = {
  EXECUTIVE: 'EXECUTIVE', // Директор
  HEAD_PRODUCTION: 'HEAD_PRODUCTION', // Начальник производства (в промышленности)
  SENIOR_MANAGER: 'SENIOR_MANAGER', // Старший менеджер
  HEAD: 'HEAD', // Начальник участка
  LEAD_MASTER: 'LEAD_MASTER', // Старший мастер
  MASTER: 'MASTER', // Сменный мастер
  DETAIL_MASTER: 'DETAIL_MASTER', // Мастер реквизитов
  PRODUCTION_FOREMAN: 'PRODUCTION_FOREMAN', // Бригадир на УОП
  PACKER: 'PACKER', // Укладчик-упаковщик
};

export const WORKSHOP = {
  W_MANAGEMENT: 'Управление',
  W_LPC4: 'ЛПЦ-4',
  W_LPC5: 'ЛПЦ-5',
  W_LPC8_UGP: 'ЛПЦ-8 (участок гнутого профиля)',
  W_LPC8_UL: 'ЛПЦ-8 (участок ленты)',
  W_LPC10: 'ЛПЦ-10',
  W_LPC11: 'ЛПЦ-11',
  W_PMP_NORTH: 'ПМП (северный блок)',
  W_PMP_SOUTH: 'ПМП (южный блок)',
  W_UVS_LPC4: 'УВС ЛПЦ-4',
  W_CENTRAL_WAREHOUSE: 'Центральный склад',
};

export const SCHEDULE = {
  S_5B1: '5-Б-1',
  S_2A: '2-А',
  S_9: '9',
  S_2: '2',
};

export const ATTENDANCE_TYPE = {
  Y: 'Я',
  V: 'В',
};

// Динамичсекие пути
export const DYNAMIC_PATHS = ['/timesheet'];

// Конфигурация меню: путь, текст, роли и цеха, которым доступен пункт
export const MENU_ITEMS = [
  {
    path: '/home',
    label: 'Главная',
    accessRules: [
      {
        roles: [
          ROLE.EXECUTIVE,
          ROLE.HEAD_PRODUCTION,
          ROLE.SENIOR_MANAGER,
          ROLE.HEAD,
          ROLE.LEAD_MASTER,
          ROLE.MASTER,
          ROLE.DETAIL_MASTER,
          ROLE.PRODUCTION_FOREMAN,
          ROLE.PACKER,
        ],
        workshops: [
          WORKSHOP.W_MANAGEMENT,
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/timesheet',
    label: 'Табель',
    accessRules: [
      {
        roles: [ROLE.HEAD, ROLE.LEAD_MASTER, ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
        ],
      },
      {
        roles: [ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [WORKSHOP.W_LPC11],
      },
    ],
  },
  {
    path: '/production',
    label: 'Производство',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/shipment',
    label: 'Отгрузка',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/pack',
    label: 'Упаковка',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/fix',
    label: 'Раскрепление',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/residue',
    label: 'Остаток',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },

  {
    path: '/employee',
    label: 'Персонал',
    accessRules: [
      {
        roles: [ROLE.LEAD_MASTER, ROLE.PRODUCTION_FOREMAN],
        workshops: [WORKSHOP.W_LPC10],
      },
      {
        roles: [ROLE.HEAD, ROLE.PRODUCTION_FOREMAN],
        workshops: [WORKSHOP.W_LPC8_UGP, WORKSHOP.W_LPC8_UL, WORKSHOP.W_LPC11],
      },
    ],
  },
];

export const PROFILE_ROLE_OPTIONS = [
  { value: 'HEAD', label: 'Начальник участка' },
  { value: 'LEAD_MASTER', label: 'Старший мастер участка' },
  { value: 'DETAIL_MASTER', label: 'Мастер реквизитов' },
  { value: 'MASTER', label: 'Сменный мастер' },
  { value: 'MECHANIC', label: 'Слесарь' },
  { value: 'PRODUCTION_FOREMAN', label: 'Бригадир УОП' },
  { value: 'PACKING_FOREMAN', label: 'Бригадир УГП' },
  { value: 'LEAD_OPERATOR', label: 'Старший оператор ПУ' },
  { value: 'OPERATOR', label: 'Оператор ПУ' },
  { value: 'DRIVER', label: 'Водитель погрузчика' },
  { value: 'STAMPER', label: 'Штамповщик' },
  { value: 'PACKER', label: 'Укладчик-упаковщик' },
  { value: 'UNIT_PACKER', label: 'Укладчик‑упаковщик ЛУМ' },
  { value: 'STACKER', label: 'Штабелировщик металла' },
  { value: 'CUTTER', label: 'Резчик холодного металла' },
];

export const TEAM_CODE_OPTIONS = [
  // { value: '', label: 'Не выбрано' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

export const SCHEDULE_CODE_OPTIONS = [
  // { value: '', label: 'Не выбрано' },
  { value: '5-Б-1', label: '5-Б-1' },
  { value: '2-А', label: '2-А' },
  { value: '9', label: '9' },
  { value: '2', label: '2' },
];

export const GRADE_CODE_OPTIONS = [
  // { value: '', label: 'Не выбрано' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },
  { value: '17', label: '17' },
];

export const PAYMENT_CODE_OPTIONS = [
  // { value: '', label: 'Не выбрано' },
  {
    value: 'ДСР',
    label: 'ДСР — Время работы с доплатой до среднего заработка',
  },
  { value: 'ОСР', label: 'ОСР — Время работы с оплатой по среднему заработку' },
  {
    value: 'РВ',
    label:
      'РВ — Работа в выходной и/или нерабочий праздничный день вне графика',
  },
  { value: 'ПП', label: 'Повременно-премиальная' },
  { value: 'ППИ', label: 'Повременно-премиальная индивидуальная' },
  {
    value: 'КСП',
    label: 'Комбинированная (премия на повременный и сдельный заработок)',
  },
  {
    value: 'СКП',
    label: 'Сдельная коллективная (премия на сдельный заработок)',
  },
  {
    value: 'СПИ',
    label: 'Сдельно-премиальная индивидуальная',
  },
];

export const DOCUMENT_TITLE_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  {
    value: 'title_transfer',
    label: 'О переводе на другую работу',
  },
  { value: 'title_relocation', label: 'О перемещении работника' },
];

export const DOCUMENT_REASON_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  {
    value: 'vacation',
    label: 'На период очередного оплачиваемого отпуска',
  },
  { value: 'fix', label: 'Для раскрепления металлопродукции' },
];

export const DOCUMENT_ACTION_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  {
    value: 'action_transfer',
    label: 'Перевести на другую работу',
  },
  { value: 'action_relocate', label: 'Переместить в другую бригаду' },
];

export const ATTENDANCE_OPTIONS = [
  { value: 'БР1', label: 'Бригада №1' },
  { value: 'БР2', label: 'Бригада №2' },
  { value: 'БР3', label: 'Бригада №3' },
  { value: 'БР4', label: 'Бригада №4' },
  { value: 'БР5', label: 'Бригада №5' },

  { value: 'Л4', label: 'ЛПЦ-4' },
  { value: 'Л5', label: 'ЛПЦ-5' },
  { value: 'Л8Г', label: 'ЛПЦ-8 (участок гнутого профиля)' },
  { value: 'Л8Л', label: 'ЛПЦ-8 (участок ленты)' },
  { value: 'Л10', label: 'ЛПЦ-10' },
  { value: 'Л11', label: 'ЛПЦ-11' },
  { value: 'ПМПЮ', label: 'ПМП (южный блок)' },
  { value: 'ПМПС', label: 'ПМП (северный блок)' },

  { value: 'А', label: 'А — Арест или задержания за правонарушения' },
  {
    value: 'Б',
    label:
      'Б — Временная нетрудоспособность и отпуска по уходу за больными, оформленные листками нетрудоспособности',
  },
  {
    value: 'БЖ',
    label: 'БЖ — Освобождение женщины от работы в связи с беременностью',
  },
  {
    value: 'БЖЧ',
    label: 'БЖЧ — Сокращение рабочей смены беременным женщинам (в часах)',
  },
  { value: 'В', label: 'В — Выходные и праздничные дни' },
  { value: 'ВЗ', label: 'ВЗ — Время работы водолаза под водой' },
  {
    value: 'ВП',
    label:
      'ВП — Целые сменные и внутрисменные простои по причинам, не зависящим от работодателя и работника',
  },
  {
    value: 'ВПА',
    label: 'ВПА — Целые сменные и внутрисменные простои по вине работодателя',
  },
  {
    value: 'ВПП',
    label:
      'ВПП — Целосменные и внутресменные простои по причинам, не зависящим от работодателя и работника (более 2/3 тарифа)',
  },
  {
    value: 'ВПР',
    label: 'ВПР — Целые сменные и внутрисменные простои по вине работника',
  },
  { value: 'ГИА', label: 'ГИА — Работа в газоизолирующих аппаратах' },
  {
    value: 'ГС',
    label:
      'ГС — Целодневные невыходы с полным сохранением заработной платы в случаях, предусмотренных законодательством',
  },
  {
    value: 'ГЧ',
    label:
      'ГЧ — Нецелодневные (часовые) невыходы с сохранением заработной платы в случаях, предусмотренных законодательством',
  },
  { value: 'Д', label: 'Д — Донорский день' },
  { value: 'ДД', label: 'ДД — Другой день отдыха' },
  { value: 'ДИ', label: 'ДИ — Нерабочий день с сохранением заработной платы' },
  {
    value: 'ДНД',
    label:
      'ДНД — Дополнительный нерабочий день после дня проведения вакцинации',
  },
  { value: 'ДО', label: 'ДО — Время прохождения диспансеризации' },
  {
    value: 'ДУ',
    label: 'ДУ — Обучение с использованием дистанционных технологий',
  },
  {
    value: 'ЗБ',
    label: 'ЗБ — Массовые неявки - забастовки (разрешенные законом)',
  },
  { value: 'К', label: 'К — Служебные командировки' },
  {
    value: 'КО',
    label:
      'КО — Компенсация за неиспользованные дни ежегодного отпуска при увольнении работника',
  },
  {
    value: 'КОТ',
    label: 'КОТ — Кратковременный целосменный отпуск с последующей отработкой',
  },
  {
    value: 'КОЧ',
    label:
      'КОЧ — Кратковременный нецелосменный отпуск с последующей отработкой',
  },
  { value: 'КУ', label: 'КУ — Направление на обучение' },
  {
    value: 'КУВ',
    label: 'КУВ — Направление на обучение (часовое во время работы)',
  },
  {
    value: 'КУД',
    label: 'КУД — Направление на обучение (дополнительно к часам работы)',
  },
  { value: 'ЛА', label: 'ЛА — Ликвидация аварии' },
  { value: 'М', label: 'М — Перерывы для кормления ребенка' },
  {
    value: 'МО',
    label: 'МО — Медицинский осмотр (обследование) в Диагностическом центре',
  },
  {
    value: 'НБ',
    label:
      'НБ — Целосменные невыходы: отпуска без сохранения заработной платы и неявки по уважительным причинам',
  },
  { value: 'НД', label: 'НД — Нерабочий праздничный день' },
  { value: 'НН', label: 'НН — Неявки по невыясненным причинам' },
  { value: 'НС', label: 'НС — Неотработанные часы' },
  {
    value: 'ОА',
    label:
      'ОА — Отпуск (оплачиваемый частично) по инициативе администрации в связи с простоем в организации',
  },
  {
    value: 'ОД',
    label:
      'ОД — Ежегодный дополнительный отпуск, предусмотренный законодательством и/или коллективным договором',
  },
  { value: 'ОЖ', label: 'ОЖ — Отпуск по уходу за ребенком от 1,5 до 3-х лет' },
  {
    value: 'ОИ',
    label:
      'ОИ — Дополнительные выходные дни работникам, осуществляющим уход за детьми-инвалидами',
  },
  { value: 'ОЛ', label: 'ОЛ — Отпуск для лечения' },
  { value: 'ОП', label: 'ОП — Доп.отпуск для профилактики проф.заболеваний' },
  {
    value: 'ОРС',
    label:
      'ОРС — Целосменное время отстранения от работы работодателем (недопущение к работе)',
  },
  {
    value: 'ОРЧ',
    label:
      'ОРЧ — Часовое время отстранения от работы работодателем (недопущение к работе)',
  },
  { value: 'ОС', label: 'ОС — Отпуск социальный' },
  { value: 'ОТ', label: 'ОТ — Ежегодный основной отпуск' },
  { value: 'ОТД', label: 'ОТД — Отработка кратковременного отпуска' },
  {
    value: 'ОТР',
    label:
      'ОТР — Работа в выходной и/или нерабочий праздничный день с предоставлением другого дня отдыха',
  },
  {
    value: 'ОТЧ',
    label: 'ОТЧ — Часовое время отработки кратковременного отпуска',
  },
  { value: 'ОУ', label: 'ОУ — Отпуск уполномоченным по охране труда' },
  { value: 'ОУТ', label: 'ОУТ — Доп. доплата за особые условия труда' },
  {
    value: 'ОЧ',
    label:
      'ОЧ — Частично оплачиваемый отпуск, предоставляемый по уходу за ребенком до достижения им возраста 1,5 лет',
  },
  {
    value: 'П',
    label: 'П — Время в пути при выполнении работ вахтовым методом',
  },
  { value: 'ПВ', label: 'ПВ — Время вынужденного прогула' },
  { value: 'ПМ', label: 'ПМ — Периодический медицинский осмотр' },
  {
    value: 'ПР',
    label:
      'ПР — Прогулы; неявки на работу без уважительной причины, отсутствие на работе без уважительной причины более четырех часов',
  },
  { value: 'ПТД', label: 'ПТД — Приостановление действия трудового договора' },
  { value: 'ПУ', label: 'ПУ — Опоздание и/или преждевременный уход' },
  { value: 'Р', label: 'Р — Отпуск по беременности и родам' },
  {
    value: 'РДЧ',
    label: 'РДЧ — Длительность перерыва при разделении рабочего дня на части',
  },
  { value: 'РН', label: 'РН — Работа в нерабочие дни' },
  { value: 'С', label: 'С — Сверхурочные часы работы' },
  {
    value: 'СД',
    label:
      'СД — Сокращенный рабочий день для женщин, не берущих частично оплачиваемый отпуск, предоставляемый по уходу за ребенком до достижения им возраста 1,5 лет',
  },
  {
    value: 'СДН',
    label:
      'СДН — Сокращенная рабочая неделя для женщин, не берущих частично оплачиваемый отпуск, предоставляемый по уходу за ребенком до достижения им возраста 1,5 лет',
  },
  { value: 'СИ', label: 'СИ — Самоизоляция' },
  { value: 'СН', label: 'СН — Сокращенная неделя по личному заявлению' },
  { value: 'СЧ', label: 'СЧ — Сокращенный день по личному заявлению' },
  {
    value: 'У',
    label:
      'У — Отпуск в связи с обучением с полным сохранением заработной платы',
  },
  {
    value: 'УД',
    label: 'УД — Отпуск в связи с обучением без сохранения заработной платы',
  },
  {
    value: 'УЧ',
    label:
      'УЧ — Отпуска в связи с обучением с частичным сохранением заработной платы (50%)',
  },
  {
    value: 'ХС',
    label:
      'ХС — Время работы сдельщиков за целые повременные смены (без премии)',
  },
  {
    value: 'ХЧ',
    label: 'ХЧ — Время работы сдельщиков за нецелые повременные смены',
  },
  {
    value: 'ЧИ',
    label: 'ЧИ — Дополнительные часы отдыха для работника-инвалида',
  },
  { value: 'Я', label: 'Я — Часы работы' },
];

export const POSITION_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  { value: '643842', label: '643842 — Начальник участка (в промышленности)' },
  { value: '643850', label: '643850 — Мастер участка (реквизитов)' },
  { value: '643843', label: '643843 — Мастер участка' },
  {
    value: '643852',
    label: '643852 — Бригадир на участках основного производства',
  },
  {
    value: '643853',
    label: '643853 — Бригадир на участках основного производства',
  },
  { value: '643847', label: '643847 — Оператор поста управления (старший)' },
  { value: '643848', label: '643848 — Оператор поста управления' },
  {
    value: '643985',
    label:
      '643985 — Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции',
  },
  {
    value: '643984',
    label:
      '643984 — Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции',
  },
  { value: '643854', label: '643854 — Водитель погрузчика' },
  { value: '643856', label: '643856 — Водитель погрузчика' },
  { value: '643844', label: '643844 — Укладчик-упаковщик' },
  { value: '643849', label: '643849 — Укладчик-упаковщик ЛУМ' },
  { value: '643845', label: '643845 — Штабелировщик металла' },
  { value: '643857', label: '643857 — Резчик холодного металла' },
];

export const PROFESSION_OPTIONS = [
  { value: 'EXECUTIVE', label: 'Директор' },
  {
    value: 'HEAD_PRODUCTION',
    label: 'Начальник производства (в промышленности)',
  },
  { value: 'SENIOR_MANAGER', label: 'Старший менеджер' },
  { value: 'MECHANIC', label: 'Механик' },
  { value: 'POWER_ENGINEER', label: 'Энергетик' },
  { value: 'LEAD_SAFETY', label: 'Ведущий специалист по охране труда' },
  { value: 'LEAD_ENGINEER', label: 'Ведущий инженер' },
  { value: 'LEAD_QUALITY', label: 'Ведущий инженер по качеству' },
  { value: 'SAFETY_SPECIALIST', label: 'Специалист по охране труда' },
  {
    value: 'PRODUCTION_ENGINEER',
    label: 'Инженер по подготовке производства первой категории',
  },
  { value: 'ADMIN_INSPECTOR', label: 'Инспектор-делопроизводитель' },
  { value: 'WORK_DISTRIBUTOR', label: 'Распределитель работ' },
  { value: 'LEAD_ECONOMIST', label: 'Ведущий экономист' },
  {
    value: 'LEAD_LABOR_ENGINEER',
    label: 'Ведущий инженер по организации и нормированию труда',
  },
  {
    value: 'LABOR_ENGINEER',
    label: 'Инженер по организации и нормированию труда первой категории',
  },
  { value: 'LEAD_SPECIALIST', label: 'Ведущий специалист' },
  { value: 'TECHNOLOGIST_LEAD', label: 'Ведущий инженер-технолог' },
  { value: 'TECHNOLOGIST', label: 'Инженер-технолог первой категории' },
  { value: 'ENGINEER', label: 'Инженер первой категории' },
  { value: 'HEAD', label: 'Начальник участка (в промышленности)' },
  { value: 'LEAD_MASTER', label: 'Старший мастер участка' },
  { value: 'DETAIL_MASTER', label: 'Мастер участка (реквизитов)' },
  { value: 'MASTER', label: 'Мастер участка' },
  { value: 'LEAD_OPERATOR', label: 'Оператор поста управления (старший)' },
  { value: 'OPERATOR', label: 'Оператор поста управления' },
  {
    value: 'PRODUCTION_FOREMAN',
    label: 'Бригадир на участках основного производства',
  },
  {
    value: 'PACKING_FOREMAN',
    label:
      'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции',
  },
  { value: 'PACKER', label: 'Укладчик-упаковщик' },
  { value: 'PACKER_APR8', label: 'Укладчик-упаковщик АПР-8' },
  { value: 'UNIT_PACKER', label: 'Укладчик-упаковщик ЛУМ' },
  { value: 'REPAIR_MECHANIC', label: 'Слесарь-ремонтник' },
  { value: 'STACKER', label: 'Штабелировщик металла' },
  { value: 'STAMPER', label: 'Штамповщик' },
  { value: 'DRIVER', label: 'Водитель погрузчика' },
  { value: 'CUTTER', label: 'Резчик холодного металла' },
  { value: 'GAS_CUTTER', label: 'Газорезчик' },
  { value: 'CRANE_OPERATOR', label: 'Машинист крана' },
  {
    value: 'LEAD_AUTOMATION',
    label:
      'Ведущий инженер по автоматизации и механизации производственных процессов',
  },
  {
    value: 'ELECTRICIAN',
    label: 'Электромонтёр по ремонту и обслуживанию электрооборудования',
  },
  {
    value: 'MATERIAL_FOREMAN',
    label:
      'Бригадир по перемещению сырья, полуфабрикатов и готовой продукции в процессе производства',
  },
  { value: 'CAR_DRIVER', label: 'Водитель автомобиля' },
  { value: 'SENIOR_WAREHOUSEMAN', label: 'Кладовщик (старший)' },
  { value: 'WAREHOUSEMAN', label: 'Кладовщик' },
];

export const PRESENT_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  { value: 'false', label: '-' },
  { value: 'true', label: '+' },
];

export const WORK_PLACES_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  {
    value: 'ЛПЦ-11',
    label: 'ЛПЦ-11',
  },
  {
    value: 'ЛУМ',
    label: 'ЛУМ',
  },
  {
    value: '1 очередь: СТАН-2000',
    label: '1 очередь: СТАН-2000',
  },
  {
    value: '2 очередь: АНГЦ + АНО-ГЦ + АИ',
    label: '2 очередь: АНГЦ + АНО-ГЦ + АИ',
  },
  {
    value: '3 очередь: АНГЦ-3',
    label: '3 очередь: АНГЦ-3',
  },
  {
    value: 'Ж/д тупик 6',
    label: 'Ж/д тупик 6',
  },
  {
    value: 'Ж/д тупик 7',
    label: 'Ж/д тупик 7',
  },
  {
    value: 'Ж/д тупик 8',
    label: 'Ж/д тупик 8',
  },
  {
    value: 'Ж/д тупик 10',
    label: 'Ж/д тупик 10',
  },
  {
    value: 'Производство реквизитов',
    label: 'Производство реквизитов',
  },
  {
    value: 'Документация',
    label: 'Документация',
  },
  {
    value: 'Интвентаризация',
    label: 'Интвентаризация',
  },
  {
    value: 'Обработка данных',
    label: 'Обработка данных',
  },
];

export const REASON_OPTIONS = [
  { value: 'Свободная позиция', label: 'Свободная позиция' },
  { value: 'На время отсутствия', label: 'На время отсутствия' },
  { value: 'На время отвлечения', label: 'На время отвлечения' },
  { value: 'Для ознакомления', label: 'Для ознакомления' },
  { value: 'Производство', label: 'Производство' },
];
