import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { ProductEntity } from './product.entity.js';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { ProductCharacteristicDto } from '../dto/product-characteristic.dto.js';

@Entity('product_characteristic')
export class ProductCharacteristicEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductEntity>;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  toDto(): ProductCharacteristicDto {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
      productId: this.productId,
    };
  }
}
