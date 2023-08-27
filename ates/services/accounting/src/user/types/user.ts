export interface IUser {
  publicId: string;
  login: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
