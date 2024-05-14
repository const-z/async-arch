import { Type } from '@sinclair/typebox';

import { EventValidator } from '../../common/common.event.schema';

export const UserDeletedEventV1Schema = Type.Object(
  {
    eventName: Type.String(),
    data: Type.Object(
      {
        publicId: Type.String(),
        deletedAt: Type.String(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export class UserDeletedEventValidatorV1 extends EventValidator {
  protected schema = UserDeletedEventV1Schema;
}
