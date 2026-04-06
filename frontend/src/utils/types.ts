export type TRole = 'ADMIN' | 'HEAD' | 'MASTER' | 'PACKER';

export const ADMIN_ROLE: TRole = 'ADMIN';
export const HEAD_ROLE: TRole = 'HEAD';
export const MASTER_ROLE: TRole = 'MASTER';
export const PACKER_ROLE: TRole = 'PACKER';

export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Администратор' },
  { value: 'HEAD', label: 'Начальник участка' },
  { value: 'MASTER', label: 'Сменный мастер' },
  { value: 'PACKER', label: 'Укладчик-упаковщик' },
];
