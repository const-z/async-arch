import { Type } from '@sinclair/typebox';

import { EventValidator } from '../../common/common.event.schema';
import { Nullable } from '../../common/nullable.schema';

export const TaskCreatedEventSchemaV1 = Type.Object({
  eventName: Type.String(),
  data: Type.Object({
    publicId: Type.String(),
    title: Type.String(),
    description: Type.Optional(Nullable(Type.String())),
    cost: Type.Number(),
    reward: Type.Number(),
    creator: Type.String(),
    executor: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    completedAt: Type.Optional(Nullable(Type.String())),
  }),
});

export class TaskCreatedEventValidatorV1 extends EventValidator {
  protected schema = TaskCreatedEventSchemaV1;
}
