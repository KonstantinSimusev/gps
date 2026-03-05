export interface IList<T> {
  total: number;
  items: T[];
}

export interface IEmployee {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  birthDay: Date;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  position: IPosition;
  team: ITeam;
}

export interface IPosition {
  id: string;
  positionCode: string;
  workshop: IWorkshop;
  profession: IProfession;
  grade: IGrade;
  schedule: ISchedule;
  role: IRole;
}

export interface IWorkshop {
  id: string;
  workshopCode: string;
}

export interface IProfession {
  id: string;
  name: string;
}

export interface IGrade {
  id: string;
  gradeCode: string;
}

export interface ISchedule {
  id: string;
  scheduleCode: string;
}

export interface IRole {
  id: string;
  name: string;
}

export interface ITeam {
  id: string;
  teamNumber: string;
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

export interface ICreatedShift {
  date: Date;
  shiftNumber: number;
}

export interface IShift {
  id: string;
  date: Date;
  shiftNumber: number;
  teamNumber: number;
  startShift: Date;
  endShift: Date;
  workshopCode: string;
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
  success?: boolean;
  message: string;
  id?: string;
}
