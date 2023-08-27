import { Type } from '@sinclair/typebox';

export enum VersionV2 {
  v1 = '1',
}

export const eventMetaV2 = {
  eventId: Type.String(),
  eventVersion: Type.Enum(VersionV2),
  eventTime: Type.Date(),
  eventName: Type.String(),
  producer: Type.String(),
};
