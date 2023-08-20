import { IUser } from '../../user/types/user';

export interface INewTaskData {
  title: string;
  description: string;
  creator: IUser;
}

export interface ICompleteTaskData {
  taskId: number;
  userPublicId: string;
}

export interface ITask {
  id: number;
  publicId: string;
  title: string;
  description?: string | null;
  cost: number;
  reward: number;
  creator: string;
  executor: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}
