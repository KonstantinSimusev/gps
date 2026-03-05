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
  // account: IAccount;
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

export interface IAccountAPI {
  lastName: string;
  firstName: string;
  patronymic: string;
  login: string;
  password: string;
}

export interface IAccount {
  id: string;
  login: string;
  hashedPassword: string;
  refreshToken: string | null;
}

// export interface IShift {
//   id: string;
//   workshopCode: string;
//   date: Date;
//   shiftNumber: number;
//   teamNumber: number;
//   startShift: Date;
//   endShift: Date;
//   usersShifts?: IUserShift[];
//   productions?: IProduction[];
//   shipments?: IShipment[];
//   packs?: IPack[];
//   fixs?: IFix[];
//   residues?: IResidue[];
// }

// export interface IUserShift {
//   id: string;
//   workStatus: string;
//   workPlace: string;
//   shiftProfession: string;
//   workHours: number;
// }

export interface ISuccess {
  message?: string;
  accessToken?: string;
  // user?: IPerson;
}
