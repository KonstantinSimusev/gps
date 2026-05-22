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
  workshopCode: string;
  teamNumber: number;
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
  role: string | null;
  isActive: boolean;
}
