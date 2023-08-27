import { Type } from '@sinclair/typebox';

import { eventMetaV2 } from '../../common/event.meta.v2';
import { EventValidator } from '../../common/common.event.schema';
import { Nullable } from '../../common/nullable.schema';

export const TaskCreatedEventSchemaV2 = Type.Object({
  ...eventMetaV2,
  data: Type.Object({
    publicId: Type.String(),
    jiraId: Type.String(),
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

export class TaskCreatedEventValidatorV2 extends EventValidator {
  schema = TaskCreatedEventSchemaV2;
}
