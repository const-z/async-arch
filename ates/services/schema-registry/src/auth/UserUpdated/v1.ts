import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/nullable';

export const UserUpdatedEventV1Schema = Type.Object({
  eventName: Type.String(),
  data: Type.Object({
    publicId: Type.String(),
    login: Type.String(),
    name: Type.String(),
    email: Type.String(),
    role: Type.KeyOf(
      Type.Object({
        admin: Type.String(),
        manager: Type.String(),
        popug: Type.String(),
      }),
    ),
    deletedAt: Type.Optional(Type.Optional(Nullable(Type.Date()))),
    createdAt: Type.Date(),
    updatedAt: Type.Date(),
  }),
});

export const Schema = JSON.stringify(UserUpdatedEventV1Schema);
