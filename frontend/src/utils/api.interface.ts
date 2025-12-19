export interface IList<T> {
  total: number;
  items: T[];
}

export interface ILoginData {
  login: string;
  password: string;
}

export interface IUser {
  id: string;
  positionCode: number;
  lastName: string;
  firstName: string;
  patronymic: string;
  profession: string;
  grade: number;
  personalNumber: number;
  teamNumber: number;
  currentTeamNumber: number;
  workSchedule: string;
  workshopCode: string;
  role: string;
  sortOrder: number;
}

export interface IShift {
  id?: string;
  date: Date;
  shiftNumber: number;
  teamNumber: number;
  startShift?: Date;
  endShift?: Date;
  usersShifts?: IUserShift[];
  productions?: IProduction[];
  residues?: IResidue[];
}

export interface IUserShift {
  id: string;
  workStatus: string;
  workPlace: string;
  shiftProfession: string;
  workHours: number;
  user?: IUser;
  shift?: IShift;
}

export interface IProduction {
  id: string;
  location?: string;
  unit?: string;
  count: number;
  sortOrder?: number;
}

export interface IShipment {
  id: string;
  location?: string;
  railway?: string;
  count: number;
  sortOrder?: number;
}

export interface IPack {
  id: string;
  location?: string;
  area?: string;
  count: number;
  sortOrder?: number;
}

export interface IFix {
  id: string;
  location?: string;
  railway?: string;
  count: number;
  sortOrder?: number;
}

export interface IResidue {
  id: string;
  location?: string;
  area?: string;
  count: number;
  sortOrder?: number;
}

export interface ICreateUserShift {
  personalNumber: number;
  shiftId: string;
}

export interface IProfession {
  profession: string;
  count: number;
}

export interface ISuccess {
  success: boolean;
  message: string;
  id?: string;
}
