const METERS_IN_KILOMETER = 1000;

export const convertKilometersToMeters = (kilometers: number): number => {
  return kilometers * METERS_IN_KILOMETER;
};

export const convertMetersToKilometers = (meters: number): number => {
  return meters / METERS_IN_KILOMETER;
};
