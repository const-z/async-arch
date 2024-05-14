export enum LogType {
  WRITEOFF = 'writeoff',
  ENROLL = 'enroll',
}

export interface AccountLog {
  id: number;
  publicId: string;
  createdAt: Date;
  type: LogType;
  amount: number;
}
