export interface INewUserData {
  login: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

export interface IUpdateUserData {
  id: number;
  password?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IDeleteUserData {
  id: number;
  deletedAt: Date;
}

export interface IUser {
  id: number;
  publicId: string;
  login: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
