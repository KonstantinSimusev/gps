export interface IList<T> {
  total: number;
  items: T[];
}

export interface ISuccess {
  message: string;
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
  workshopCode: string;
  teamNumber: string;
  role: string;
}

export interface IEmployeeInfo {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  workshop: string;
  profession: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  grade: string;
  schedule: string;
  birthDay: string;
  startDate: string;
  endDate: string | null;
  hasAccess: boolean;
  isActive: boolean;

  currentTeamNumber: string | null;
  currentPositionCode: string | null;

  role: string;
}

export interface ICreateEmployee {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  birthDay: string;
  startDate: string;
}

export interface IUpdateEmployee {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;

  currentTeamNumber: string | null;
  currentPositionCode: string | null;

  birthDay: string;
  startDate: string;
  endDate: string | null;

  hasAccess: boolean;
  role: string | null;
}

export interface IShiftData {
  master: IMaster;
  shifts: IShift[];
}

export interface IMaster {
  lastName: string;
  firstName: string;
  patronymic: string;
  profession: string;
  workshopCode: string;
  teamNumber: string;
}

export interface IShift {
  id: string;
  date: string; // формат 'YYYY-MM-DD'
  shiftNumber: string;
}

export interface IEmployee {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  profession: string;
  personalNumber: string;
  positionCode: string;
  grade: string;
  schedule: string;
  birthDay: string;
  shift: IEmployeeShift;
}

export interface IEmployeeShift {
  id: string;
  status: string; // например, 'Явка'
  profession: string;
  area: string; // например, 'ЛУМ'
  hours: string; // например, '11.5' (строка с дробным числом)
}
