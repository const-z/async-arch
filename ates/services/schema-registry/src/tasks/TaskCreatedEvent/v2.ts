import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/nullable';

export enum VersionV2 {
  v2 = '2',
}

export const TaskCreatedEventV2Schema = Type.Object({
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
    createdAt: Type.Date(),
    updatedAt: Type.Date(),
    completedAt: Type.Optional(Nullable(Type.Date())),
  }),
});

export const Schema = JSON.stringify(TaskCreatedEventV2Schema);
