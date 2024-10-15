import { UserStatusDto } from '../dto/user-status.dto.js';
import { UserStatusEntity } from '../entities/user-status.entity.js';

export class UserStatusAdapter {
  static toDto(entity: UserStatusEntity): UserStatusDto {
    return {
      name: entity.name,
      cost: entity.cost,
    };
  }
}
