import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/nullable';

export const TaskCreatedEventV1Schema = Type.Object({
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

export const Schema = JSON.stringify(TaskCreatedEventV1Schema);
