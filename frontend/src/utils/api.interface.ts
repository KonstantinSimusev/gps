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

export interface IProfile {
  employeeId: string;
  workshopCode: string;
  teamNumber: string;
  roleId: string;
  role: string;
}

export interface IEmployeeInfo {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  workshop: string;
  team: string;
  profession: string;
  personalNumber: string;
  positionCode: string;
  grade: string;
  schedule: string;
  birthDay: string;
  startDate: string;
  endDate: string | null;
  role: string | null;
}
