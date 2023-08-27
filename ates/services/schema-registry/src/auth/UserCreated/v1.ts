import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/nullable.schema';
import { EventValidator } from '../../common/common.event.schema';

export const UserCreatedEventV1Schema = Type.Object(
  {
    eventName: Type.String(),
    data: Type.Object(
      {
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
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export class UserCreatedEventValidatorV1 extends EventValidator {
  protected schema = UserCreatedEventV1Schema;
}
