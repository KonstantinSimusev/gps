export const ROLE = {
  ADMIN: 'ADMIN',
  HEAD: 'HEAD',
  LEAD_MASTER: 'LEAD_MASTER',
  MASTER: 'MASTER',
  DETAIL_MASTER: 'DETAIL_MASTER',
  PACKER: 'PACKER',
};

export const ROLE_TO_PAGE: { [key: string]: string } = {
  ADMIN: '/admin',
  HEAD: '/home',
  MASTER: '/timesheet',
  LEAD_MASTER: '/timesheet',
  DETAIL_MASTER: '/timesheet',
  PACKER: '/scan',
};

export const ROLE_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'ADMIN', label: 'Администратор' },
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

export const REASON_OPTIONS = [
  { value: 'Свободная позиция', label: 'Свободная позиция' },
  { value: 'На время отсутствия', label: 'На время отсутствия' },
  { value: 'На время отвлечения', label: 'На время отвлечения' },
  { value: 'Для ознакомления', label: 'Для ознакомления' },
  { value: 'Производство', label: 'Производство' },
];
