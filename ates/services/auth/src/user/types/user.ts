export interface INewUserData {
  login: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

export interface IUpdateUserData {
  id: string;
  password?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IUser {
  id: string;
  login: string;
  password: string;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  blockedAt: Date;
  deletedAt: Date;
}
