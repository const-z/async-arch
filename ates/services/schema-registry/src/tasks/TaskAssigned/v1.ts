import { Type } from '@sinclair/typebox';

import { EventValidator } from '../../common/common.event.schema';
import { Nullable } from '../../common/nullable.schema';

export const TaskAssignedEventSchemaV1 = Type.Object({
  eventName: Type.String(),
  data: Type.Object({
    publicId: Type.String(),
    title: Type.String(),
    description: Type.Optional(Nullable(Type.String())),
    cost: Type.Number(),
    reward: Type.Number(),
    creator: Type.String(),
    executor: Type.String(),
    createdAt: Type.Date(),
    updatedAt: Type.Date(),
    completedAt: Type.Optional(Nullable(Type.Date())),
  }),
});

export class TaskAssignedEventValidatorV1 extends EventValidator {
  protected schema = TaskAssignedEventSchemaV1;
}
