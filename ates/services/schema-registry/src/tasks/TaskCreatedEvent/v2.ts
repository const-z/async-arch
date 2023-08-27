import { Type, Static, TSchema } from '@sinclair/typebox';

import { eventMetaV2 } from '../../common/event.meta.v2';

import { CommonEventSchema } from '../../common/common.event.schema';

const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

export const TaskCreatedEventV2 = Type.Object({
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

export type TaskCreatedEventV2Type = Static<typeof TaskCreatedEventV2>;

export class TaskCreatedSchemaV2 extends CommonEventSchema {
  schema = TaskCreatedEventV2;
}
