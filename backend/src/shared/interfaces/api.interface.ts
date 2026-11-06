export interface IList<T> {
  total: number;
  items: T[];
}

export interface ISuccess {
  message: string;
}

export interface ITokenOptions<T> {
  payload: T;
  secretKey: string; // ключ в конфиге для секрета
  expiresInKey: string; // ключ в конфиге для времени жизни
}

export interface IJwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface INotice {
  id: string;

  // Главные поля для маршрутизации
  sourceId: string | null;
  sourceDate: string | null; // ISO 8601, например "2026-09-20" или null

  // Данные заголовка (из связи с NoticeTitle)
  categoryCode: string;
  titleText: string;
  statusLabel: string;
  actionCode: string;
  actionLabel: string;

  // Связанные справочники
  workshopCode: string;
  teamNumber: number;
  scheduleCode: string;

  // Статусы
  isUnread: boolean;
  isResolved: boolean;

  // Метки времени
  createdAt: string; // ISO 8601
}

export interface IAccountInfo {
  lastName: string;
  firstName: string;
  patronymic: string;
  login: string;
  password: string;
}

export interface IProfile {
  employeeId: string;

  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: number;

  profileWorkshopCode: string;
  profileTeamNumber: number;
  profilePositionCode: number;
  profileGradeCode: number;
  profileScheduleCode: string;
  profilePaymentCode: string;
  profileProfessionName: string;
  profileRoleName: string;

  hasAccess: boolean;
}

export interface IEmployeeInfo {
  id: string;

  profileWorkshopCode: string;
  profileTeamNumber: number;
  profilePositionCode: number;
  profileGradeCode: number;
  profileScheduleCode: string;
  profilePaymentCode: string;
  profileProfessionName: string;
  profileRoleName: string;

  hasAccess: boolean;

  lastName: string;
  firstName: string;
  patronymic: string;
  professionName: string;
  workshopCode: string;
  teamNumber: number;
  personalNumber: number;
  positionCode: number;
  gradeCode: number;
  scheduleCode: string;
  paymentCode: string;
  birthDay: Date;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
}

export interface IShiftInfo {
  dayOfWeek: number;
  date: Date;
  shiftCode: number | null;
  teamNumber: number;
}

export interface IShift {
  id: string;
  date: Date; // формат YYYY-MM-DD
  workshopCode: string;
  teamNumber: number;
  scheduleCode: string;
  dayOfWeek: number;
  shiftCode: number | null;
  employeeShifts: IEmployeeShift[];
}

export interface IEmployeeShift {
  id: string;
  currentPositionCode: number; // берем из распоряжения, если нет из КЛС
  currentProfessionName: string; // берем из распоряжения, если нет из КЛС
  currentPaymentCode: string; // берем из распоряжения, если нет из КЛС
  attendanceCode: string;
  minutes: number;
  isPresent: boolean | null;
  workplaceName: string | null;
  canDelete: boolean;
  isReady: boolean;
  employee: IEmployee;
}

export interface IEmployee {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: number;
  workshopCode: string;
  teamNumber: number;
  positionCode: number;
  professionCode: string;
  professionName: string;
  gradeCode: number;
  scheduleCode: string;
  paymentCode: string;
}

export interface IDocument {
  documentTitleCode: string | null;
  documentReasonCode: string | null;
  documentActionCode: string | null;
  documentPaymentCode: string | null;
  documentStartDate: Date | null;
  documentEndDate: Date | null;
  documentAbsentEmpNumber: number | null;
}

// export interface IShiftSchedule {
//   id: string;
//   dayOfWeek: number;
//   startTime: string;
//   endTime: string;
//   lunchStart: string;
//   lunchEnd: string;
//   shiftType: IShiftType;
// }

// export interface IShiftType {
//   id: string;
//   shiftCode: number;
// }

// export interface ITeam {
//   id: string;
//   teamNumber: number;
// }

// export interface IWorkshop {
//   id: string;
//   workshopCode: string;
// }

// export interface IAttendanceType {
//   id: string;
//   attendanceCode: string;
//   description: string;
// }

// export interface IWorkplace {
//   id: string;
//   name: string;
// }

// export interface IPosition {
//   id: string;
//   positionCode: number;
//   profession: IProfession;
//   grade: IGrade;
//   schedule: ISchedule;
// }

// export interface IProfession {
//   id: string;
//   name: string;
// }

// export interface IGrade {
//   id: string;
//   gradeCode: number;
// }

// export interface ISchedule {
//   id: string;
//   scheduleCode: string;
// }
