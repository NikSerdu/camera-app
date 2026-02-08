import type { Status } from '@eyenest/contracts/gen/ts/camera';

const StatusValues = {
  ON: 0,
  OFF: 1,
  UNRECOGNIZED: -1,
} as const;

export const mapStatus = (value: string): Status => {
  switch (value) {
    case 'ON':
      return StatusValues.ON;
    case 'OFF':
      return StatusValues.OFF;
    default:
      return StatusValues.UNRECOGNIZED;
  }
};
