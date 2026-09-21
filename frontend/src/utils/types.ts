export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
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

export const ROLE_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'ADMIN', label: 'Администратор' },
  { value: 'HEAD', label: 'Начальник участка' },
  { value: 'LEAD_MASTER', label: 'Старший мастер участка' },
  { value: 'DETAIL_MASTER', label: 'Мастер реквизитов' },
  { value: 'MASTER', label: 'Сменный мастер' },
];

export const PROFILE_ROLE_OPTIONS = [
  { value: 'USER', label: 'Не назначена' },
  { value: 'ADMIN', label: 'Администратор' },
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
  { value: '', label: 'Выберите бригаду' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

export const SCHEDULE_CODE_OPTIONS = [
  { value: '', label: 'Выбирите график' },
  { value: '5-Б-1', label: '5-Б-1' },
  { value: '2-А', label: '2-А' },
  { value: '9', label: '9' },
  { value: '2', label: '2' },
];

export const GRADE_CODE_OPTIONS = [
  { value: '', label: 'Выберите разряд' },
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

export const REASON_OPTIONS = [
  { value: 'Свободная позиция', label: 'Свободная позиция' },
  { value: 'На время отсутствия', label: 'На время отсутствия' },
  { value: 'На время отвлечения', label: 'На время отвлечения' },
  { value: 'Для ознакомления', label: 'Для ознакомления' },
  { value: 'Производство', label: 'Производство' },
];

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
