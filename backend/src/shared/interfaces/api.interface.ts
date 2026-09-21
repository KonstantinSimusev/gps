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
  category: string;
  title: string;
  status: string;
  action: string;
  isUnread: boolean;
  isResolved: boolean;
  createdAt: string; // ISO 8601, например "2026-09-20T14:30:00.123Z"
  updatedAt: string; // ISO 8601, например "2026-09-20T14:30:00.123Z"
}

export interface IProfile {
  employeeId: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: number;
  profession: string;
  workshopCode: string;
  teamNumber: number;
  scheduleCode: string;
  role: string;
}

export interface IAccountInfo {
  lastName: string;
  firstName: string;
  patronymic: string;
  login: string;
  password: string;
}

export interface IEmployeeInfo {
  id: string;

  lastName: string;
  firstName: string;
  patronymic: string;
  profession: string;

  workshop: string;
  teamNumber: number;
  personalNumber: number;
  positionCode: number;
  gradeCode: number;
  scheduleCode: string;

  currentTeamNumber: number | null;
  currentPositionCode: number | null;
  currentGradeCode: number | null;
  currentScheduleCode: string | null;

  birthDay: Date;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;

  role: string;
  hasAccess: boolean;
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
  schedule: ISchedule;
  shiftSchedule: IShiftSchedule;
  team: ITeam;
  workshop: IWorkshop;
  isChecked: boolean;
  isAssignmentComplete: boolean;
}

export interface ISchedule {
  id: string;
  scheduleCode: string;
}

export interface IShiftSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  shiftType: IShiftType;
}

export interface IShiftType {
  id: string;
  shiftCode: number;
}

export interface ITeam {
  id: string;
  teamNumber: number;
}

export interface IWorkshop {
  id: string;
  workshopCode: string;
}

export interface IEmployeeShiftList {
  items: IEmployeeShift[];
  total: number;
  isAssignmentComplete: boolean;
}

export interface IEmployeeShift {
  id: string;
  isPresent: boolean | null;
  minutes: number;
  employee: IEmployee;
  currentPosition: IPosition;
  attendanceType: IAttendanceType;
  workPlace: IWorkPlace | null;
}

export interface IEmployee {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: number;
  birthDay: Date; // формат YYYY-MM-DD
  startDate: Date; // формат YYYY-MM-DD
  endDate: Date | null; // формат YYYY-MM-DD
  isActive: boolean;
  hasAccess: boolean;
  position: IPosition;
}

export interface IAttendanceType {
  id: string;
  attendanceCode: string;
  description: string;
}

export interface IWorkPlace {
  id: string;
  name: string;
}

export interface IPosition {
  id: string;
  positionCode: number;
  profession: IProfession;
  grade: IGrade;
  schedule: ISchedule;
}

export interface IProfession {
  id: string;
  name: string;
}

export interface IGrade {
  id: string;
  gradeCode: number;
}
