
export interface IUser {
  id: string;
  login: string;
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
