export enum ERole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EXECUTIVE = 'EXECUTIVE', // Директор
  HEAD_PRODUCTION = 'HEAD_PRODUCTION', // Начальник производства (в промышленности)
  SENIOR_MANAGER = 'SENIOR_MANAGER', // Старший менеджер
  HEAD = 'HEAD',
  LEAD_MASTER = 'LEAD_MASTER',
  MASTER = 'MASTER',
  DETAIL_MASTER = 'DETAIL_MASTER',
  PRODUCTION_FOREMAN = 'PRODUCTION_FOREMAN',
  PACKER = 'PACKER',
}

// ── categoryCode ──
export enum ENoticeCategory {
  DOCUMENT = 'document',
  SHIFT = 'shift',
}

// ── actionCode ──
export enum ENoticeAction {
  CREATE = 'create',
  FILL = 'fill',
  SIGN = 'sign',
}

// ── titleText ──
export enum ENoticeTitle {
  TIMESHEET = 'Табель',
  ORDER = 'Приказ',
  INSTRUCTION = 'Распоряжение',
  STATEMENT = 'Заявление',
  ACT = 'Акт',
}

// ── actionLabel ──
export enum ENoticeActionLabel {
  CREATE_SHIFT = 'Создать смену',
  FILL_SHIFT = 'Заполнить смену',
  SIGN_DOCUMENT = 'Подписать документ',
}

// ── statusText (не в БД, генерируется динамически) ──
export enum ENoticeStatus {
  SHIFT_NOT_CREATED = 'Смена не создана',
  SHIFT_NOT_FILLED = 'Смена не заполнена',
  DOCUMENT_NOT_SIGNED = 'Документ не подписан',
}

export enum EWorkshop {
  W_Management = 'Управление',
  W_LPC4 = 'ЛПЦ-4',
  W_LPC5 = 'ЛПЦ-5',
  W_LPC8_UGP = 'ЛПЦ-8 (участок гнутого профиля)',
  W_LPC8_UL = 'ЛПЦ-8 (участок ленты)',
  W_LPC10 = 'ЛПЦ-10',
  W_LPC11 = 'ЛПЦ-11',
  W_PMP_North = 'ПМП (северный блок)',
  W_PMP_South = 'ПМП (южный блок)',
  W_UVS_LPC4 = 'УВС ЛПЦ-4',
  W_CentralWarehouse = 'Центральный склад',
}

export enum ESchedule {
  S_5B1 = '5-Б-1',
  S_2A = '2-А',
  S_9 = '9',
  S_2 = '2',
}

export enum EAttendanceCode {
  A = 'А',
  BJ = 'БЖ',
  BJC = 'БЖЧ',
  V = 'В',
  VZ = 'ВЗ',
  VP = 'ВП',
  VPA = 'ВПА',
  VPP = 'ВПП',
  VPR = 'ВПР',
  GIA = 'ГИА',
  GS = 'ГС',
  GC = 'ГЧ',
  D = 'Д',
  DD = 'ДД',
  DI = 'ДИ',
  DND = 'ДНД',
  DO = 'ДО',
  DSR = 'ДСР',
  DU = 'ДУ',
  ZB = 'ЗБ',
  K = 'К',
  KO = 'КО',
  KOT = 'КОТ',
  KOC = 'КОЧ',
  KU = 'КУ',
  KUV = 'КУВ',
  KUD = 'КУД',
  LA = 'ЛА',
  M = 'М',
  MO = 'МО',
  NB = 'НБ',
  ND = 'НД',
  NN = 'НН',
  NS = 'НС',
  OA = 'ОА',
  OD = 'ОД',
  OJ = 'ОЖ',
  OI = 'ОИ',
  OL = 'ОЛ',
  OP = 'ОП',
  ORS = 'ОРС',
  ORC = 'ОРЧ',
  OS = 'ОС',
  OSR = 'ОСР',
  OT = 'ОТ',
  OTD = 'ОТД',
  OTR = 'ОТР',
  OTC = 'ОТЧ',
  OU = 'ОУ',
  OUT = 'ОУТ',
  OC = 'ОЧ',
  P = 'П',
  PV = 'ПВ',
  PM = 'ПМ',
  PR = 'ПР',
  PTD = 'ПТД',
  PU = 'ПУ',
  R = 'Р',
  RV = 'РВ',
  RDC = 'РДЧ',
  RN = 'РН',
  S = 'С',
  SD = 'СД',
  SDN = 'СДН',
  SI = 'СИ',
  SN = 'СН',
  SC = 'СЧ',
  U = 'У',
  UD = 'УД',
  UC = 'УЧ',
  HS = 'ХС',
  HC = 'ХЧ',
  CI = 'ЧИ',
  Y = 'Я',
}

export enum EUnit {
  // ЛПЦ-5
  LPC_4 = 'ЛПЦ-4',
  NTA = 'НТА',
  NTA_K = 'НТА-К',
  APR_2 = 'АПР-2',
  APR_3 = 'АПР-3',
  APR_4 = 'АПР-4',
  APR_5 = 'АПР-5',
  APR_8 = 'АПР-8',
  APR_9 = 'АПР-9',

  // ЛПЦ-11
  STAN = 'СТАН-2000',
  ANGZ = 'АНГЦ',
  ANO = 'АНО-ГЦ',
  AI = 'АИ',
  ANGZ_3 = 'АНГЦ-3',
  LUM = 'ЛУМ',
}

export enum ERailway {
  // ЛПЦ-11
  TUPIC_6 = 'Тупик 6',
  TUPIC_7 = 'Тупик 7',
  TUPIC_8 = 'Тупик 8',
  TUPIC_10 = 'Тупик 10',

  // ЛПЦ-5
  TUPIC_10_1 = 'Тупик 10/1',
  TUPIC_10_2 = 'Тупик 10/2',
  TUPIC_12 = 'Тупик 12',
}
