import { PropertyOptions } from 'adminjs';

export type ResourceProperties<Type> = Partial<
  Record<keyof Type, PropertyOptions>
>;
