export const employeesData = {
  total: 3,
  employees: [
    {
      id: 'w1',
      lastName: 'Pack_1',
      firstName: 'GPS',
      patronymic: 'PRO',
      profession: 'Укладчик-упаковщик',
      personalNumber: '111',
      positionCode: '111',
      grade: '3',
      schedule: '2-А',
      birthDay: '2000-01-01',
      shift: {
        id: 'sh1',
        status: 'Явка',
        profession: 'Штабелировщик металла',
        area: 'ЛУМ',
        hours: '11.5',
      },
    },
    {
      id: 'w2',
      lastName: 'Pack_2',
      firstName: 'GPS',
      patronymic: 'PRO',
      profession: 'Укладчик-упаковщик',
      personalNumber: '222',
      positionCode: '222',
      grade: '3',
      schedule: '2-А',
      birthDay: '2000-01-01',
      shift: {
        id: 'sh2',
        status: 'Явка',
        profession: 'Штабелировщик металла',
        area: 'ЛУМ',
        hours: '11.5',
      },
    },
    {
      id: 'w3',
      lastName: 'Pack_3',
      firstName: 'GPS',
      patronymic: 'PRO',
      profession: 'Укладчик-упаковщик',
      personalNumber: '333',
      positionCode: '333',
      grade: '3',
      schedule: '2-А',
      birthDay: '2000-01-01',
      shift: {
        id: 'sh3',
        status: 'Явка',
        profession: 'Штабелировщик металла',
        area: 'ЛУМ',
        hours: '11.5',
      },
    },
  ],
};

export const shiftData = {
  total: 4,
  shifts: [
    {
      id: '1',
      date: '2026-05-10',
      shiftNumber: '1',
    },
    {
      id: '2',
      date: '2026-05-11',
      shiftNumber: '2',
    },
    {
      id: '3',
      date: '2026-05-12',
      shiftNumber: '1',
    },
    {
      id: '4',
      date: '2026-05-13',
      shiftNumber: '2',
    },
  ],
};

export const masterData = {
  lastName: 'Admin',
  firstName: 'Gps',
  patronymic: 'Pro',
  profession: 'Мастер участка',
  workshopCode: 'ЛПЦ-11',
  teamNumber: '3',
};
