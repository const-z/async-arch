import { Type, Static, TSchema } from '@sinclair/typebox';
import { CommonEventSchema } from '../../common/common.event.schema';

const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

export const TaskCreatedEventV1 = Type.Object({
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

export type TaskCreatedEventV1Type = Static<typeof TaskCreatedEventV1>;

export class TaskCreatedSchemaV1 extends CommonEventSchema {
  protected schema = TaskCreatedEventV1;
}
