import { Type } from '@sinclair/typebox';

export const UserDeletedEventV1Schema = Type.Object({
  eventName: Type.String(),
  data: Type.Object({
    publicId: Type.String(),
    deletedAt: Type.Date(),
  }),
});

export const Schema = JSON.stringify(UserDeletedEventV1Schema);
