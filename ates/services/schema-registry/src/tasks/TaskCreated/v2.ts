import { Type } from '@sinclair/typebox';

import { EventValidator } from '../../common/common.event.schema';
import { Nullable } from '../../common/nullable.schema';

export enum VersionV2 {
  v1 = '2',
}

export const TaskCreatedEventSchemaV2 = Type.Object({
  eventId: Type.String(),
  eventVersion: Type.Enum(VersionV2),
  eventTime: Type.Date(),
  eventName: Type.String(),
  producer: Type.String(),
  data: Type.Object({
    publicId: Type.String(),
    jiraId: Type.String(),
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

export class TaskCreatedEventValidatorV2 extends EventValidator {
  schema = TaskCreatedEventSchemaV2;
}
