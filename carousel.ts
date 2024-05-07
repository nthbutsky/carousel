export const CAROUSEL_TYPE = {
  DEFAULT: 'DEFAULT',
  IMAGES: 'IMAGES',
} as const;

type TObjectValues<T> = T[keyof T];

export type TCarouselType = TObjectValues<typeof CAROUSEL_TYPE>;
