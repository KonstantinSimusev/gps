export interface IList<T> {
  total: number;
  items: T[];
}

export interface ISuccess {
  message: string;
}

type TStatus =
  | 'Смена не создана'
  | 'Смена не заполнена'
  | 'Документ не подписан';

export interface IMessage {
  id: string;
  category: string;
  title: string;
  statusText: TStatus;
  itemId: string;
  actionLabel: string;
  isUnread: boolean;
  isResolved: boolean;
  createdAt: string; // ISO 8601, например "2026-09-20T14:30:00.123Z"
}

export interface ILoginData {
  login: string;
  password: string;
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
  profession: string;
  workshopCode: string;
  teamNumber: number;
  scheduleCode: string;
  role: string;
}

export interface IEmployeeInfo {
  id: string;

  lastName: string;
  firstName: string;
  patronymic: string;
  profession: string;

  workshop: string;
  teamNumber: string;
  personalNumber: string;
  positionCode: string;
  gradeCode: string;
  scheduleCode: string;

  currentTeamNumber: string | null;
  currentPositionCode: string | null;
  currentGradeCode: string | null;
  currentScheduleCode: string | null;

  birthDay: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;

  role: string;
  hasAccess: boolean;
}

export interface ICreateEmployee {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  gradeCode: string;
  scheduleCode: string;
  birthDay: string;
  startDate: string;
}

export interface IUpdateEmployee {
  id: string;

  currentTeamNumber: string | null;
  currentPositionCode: string | null;
  currentGradeCode: string | null;
  currentScheduleCode: string | null;

  hasAccess: boolean;

  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  gradeCode: string;
  scheduleCode: string;

  birthDay: string;
  startDate: string;
  endDate: string | null;
}

export interface IShift {
  id: string;
  date: string; // формат YYYY-MM-DD
  schedule: ISchedule;
  shiftSchedule: IShiftSchedule | null;
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
  birthDay: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  endDate: string | null;
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
