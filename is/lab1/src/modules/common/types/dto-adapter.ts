export type Adapter<Dto extends object, Entity extends object> = {
  toDto(entity: Entity): Dto;
};
