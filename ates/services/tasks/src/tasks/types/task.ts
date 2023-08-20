import { IUser } from '../../user/types/user';

export interface INewTaskData {
  title: string;
  description: string;
  creator: IUser;
}

export interface ICloseTaskData {
  id: number;
}

export interface ITask {
  id: number;
  publicId: string;
  title: string;
  description: string;
  cost: number;
  reward: number;
  creator: string;
  executor: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}
