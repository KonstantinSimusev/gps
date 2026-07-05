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

export interface IProfile {
  employeeId: string;
  lastName: string;
  firstName: string;
  patronymic: string;
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
  workshop: string;
  teamNumber: number;
  profession: string;
  personalNumber: number;
  positionCode: number;
  grade: number;
  schedule: string;
  birthDay: Date;
  startDate: Date;
  endDate: Date | null;
  hasAccess: boolean;
  isActive: boolean;

  currentTeamNumber: number | null;
  currentPositionCode: number | null;

  role: string | null;
}

export interface IShift {
  id: string;
  date: Date; // формат 'YYYY-MM-DD'
  dayOfWeek: string | null; // бригада 1-4 - null, бригада 5 - понедельник (например)
  description: string | null; // бригада 1-4 - Смена 1/2, бригада 5 - null
}
