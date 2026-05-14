import { Timestamp } from 'google/protobuf/timestamp';

export function toProtoTimestamp(date: Date): Timestamp {
  const ms = date.getTime();
  return {
    seconds: Math.floor(ms / 1000),
    nanos: (ms % 1000) * 1_000_000,
  };
}

export function fromProtoTimestamp(ts: Timestamp): Date {
  return new Date(ts.seconds * 1000 + ts.nanos / 1_000_000);
}
