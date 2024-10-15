import { Column, Entity, Point } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';

@Entity('shop')
export class ShopEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    // eslint-disable-next-line @cspell/spellchecker -- extension parameter setup
    srid: 4326,
  })
  location: Point;
}
