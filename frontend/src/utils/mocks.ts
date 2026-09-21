import { IMessage } from './api.interface';

export const mockMessages: IMessage[] = [
  {
    id: '1',
    category: 'document',
    title: 'Распоряжение от 12.09.2026',
    statusText: 'Документ не подписан',
    itemId: '11',
    actionLabel: 'Подписать',
    isUnread: true,
    isResolved: false,
    createdAt: '2026-09-20T09:15:00.000Z',
  },
  {
    id: '2',
    category: 'shift',
    title: 'Табель от 12.09.2026',
    statusText: 'Смена не заполнена',
    itemId: '52f730aa-29bd-4b2a-a498-5927e9060e03',
    actionLabel: 'Заполнить',
    isUnread: true,
    isResolved: false,
    createdAt: '2026-09-19T09:15:00.000Z',
  },

  {
    id: '3',
    category: 'shift',
    title: 'Табель от 11.09.2026',
    statusText: 'Смена не создана',
    itemId: '52f730aa-29bd-4b2a-a498-5927e9060e03',
    actionLabel: 'Создать',
    isUnread: true,
    isResolved: false,
    createdAt: '2026-09-18T09:15:00.000Z',
  },
  {
    id: '4',
    category: 'document',
    title: 'Распоряжение от 12.09.2026',
    statusText: 'Документ не подписан',
    itemId: '11',
    actionLabel: 'Подписать',
    isUnread: true,
    isResolved: false,
    createdAt: '2026-08-20T09:15:00.000Z',
  },
  {
    id: '4',
    category: 'document',
    title: 'Распоряжение от 12.09.2026',
    statusText: 'Документ не подписан',
    itemId: '11',
    actionLabel: 'Подписать',
    isUnread: true,
    isResolved: false,
    createdAt: '2026-06-20T09:15:00.000Z',
  },
];

// export const mockMessages: IMessage[] = [
//   // --- СЕГОДНЯ (21.09, понедельник) → покажет время ---
//   {
//     id: '1',
//     category: 'document',
//     title: 'Распоряжение от 21.09.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-21T03:00:00.000Z', // 08:00 по UTC+5
//   },
//   {
//     id: '2',
//     category: 'document',
//     title: 'Распоряжение от 21.09.2026 (днём)',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-21T09:15:00.000Z', // 14:15 по UTC+5
//   },
//   {
//     id: '3',
//     category: 'document',
//     title: 'Распоряжение от 21.09.2026 (вечером)',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-21T15:30:00.000Z', // 20:30 по UTC+5
//   },

//   // --- ВЧЕРА (20.09, воскресенье) → "вчера" ---
//   {
//     id: '4',
//     category: 'shift',
//     title: 'Табель от 20.09.2026',
//     statusText: 'Смена не заполнена',
//     itemId: '52f730aa-29bd-4b2a-a498-5927e9060e03',
//     actionLabel: 'Заполнить',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-20T09:15:00.000Z',
//   },

//   // --- 2 ДНЯ НАЗАД (19.09, суббота) → "суббота" ---
//   {
//     id: '5',
//     category: 'shift',
//     title: 'Табель от 19.09.2026',
//     statusText: 'Смена не создана',
//     itemId: '52f730aa-29bd-4b2a-a498-5927e9060e03',
//     actionLabel: 'Создать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-19T09:15:00.000Z',
//   },

//   // --- 3 ДНЯ НАЗАД (18.09, пятница) → "пятница" ---
//   {
//     id: '6',
//     category: 'document',
//     title: 'Распоряжение от 18.09.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-18T09:15:00.000Z',
//   },

//   // --- 4 ДНЯ НАЗАД (17.09, четверг) → "четверг" ---
//   {
//     id: '7',
//     category: 'shift',
//     title: 'Табель от 17.09.2026',
//     statusText: 'Смена не заполнена',
//     itemId: '52f730aa-29bd-4b2a-a498-5927e9060e03',
//     actionLabel: 'Заполнить',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-17T09:15:00.000Z',
//   },

//   // --- 5 ДНЕЙ НАЗАД (16.09, среда) → "среда" ---
//   {
//     id: '8',
//     category: 'document',
//     title: 'Распоряжение от 16.09.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-16T09:15:00.000Z',
//   },

//   // --- 6 ДНЕЙ НАЗАД (15.09, вторник) → "вторник" ---
//   {
//     id: '9',
//     category: 'shift',
//     title: 'Табель от 15.09.2026',
//     statusText: 'Смена не создана',
//     itemId: '52f730aa-29bd-4b2a-a498-5927e9060e03',
//     actionLabel: 'Создать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-15T09:15:00.000Z',
//   },

//   // --- 7 ДНЕЙ НАЗАД (14.09, понедельник) → "понедельник" ---
//   //    (последний день диапазона, дальше — полная дата)
//   {
//     id: '10',
//     category: 'document',
//     title: 'Распоряжение от 14.09.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-14T09:15:00.000Z',
//   },

//   // --- 8 ДНЕЙ НАЗАД (13.09, воскресенье) → 13.09.2026 ---
//   //    (первый день за пределами недели — переход на формат ДД.ММ.ГГГГ)
//   {
//     id: '11',
//     category: 'document',
//     title: 'Распоряжение от 13.09.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-09-13T09:15:00.000Z',
//   },

//   // --- ДАЛЬШЕ — тоже полная дата ---
//   {
//     id: '12',
//     category: 'document',
//     title: 'Распоряжение от 20.08.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-08-20T09:15:00.000Z',
//   },
//   {
//     id: '13',
//     category: 'document',
//     title: 'Распоряжение от 20.06.2026',
//     statusText: 'Документ не подписан',
//     itemId: '11',
//     actionLabel: 'Подписать',
//     isUnread: true,
//     isResolved: false,
//     createdAt: '2026-06-20T09:15:00.000Z',
//   },
// ];
