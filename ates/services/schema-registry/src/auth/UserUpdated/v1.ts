import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/nullable.schema';
import { EventValidator } from '../../common/common.event.schema';

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
    deletedAt: Type.Optional(
      Type.Optional(Nullable(Type.String())),
    ),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
});

export class UserUpdatedEventValidatorV1 extends EventValidator {
  protected schema = UserUpdatedEventV1Schema;
}
