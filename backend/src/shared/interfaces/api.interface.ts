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

export interface IEmployee {
  id: string;
  workshopCode: string;
  teamNumber: string;
  role: string;
  isActive: boolean;
}

export interface IAccountAPI {
  lastName: string;
  firstName: string;
  patronymic: string;
  login: string;
  password: string;
}
