import { addMilliseconds, startOfDay } from 'date-fns';

import { lifetimePointsConfig } from '../../config/lifetime-points.js';
import { UserDto } from '../dto/user.dto.js';
import { UserEntity } from '../entities/user.entity.js';

export class UserAdapter {
  static toDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      email: entity.email,
      role: entity.role,
      status: entity.status.name,
      address: entity.address,
      businessName: entity.businessName,
      city: entity.city,
      dateOfBirth: entity.dateOfBirth,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      pointsAmount: entity.pointsAmount,
      postalCode: entity.postalCode,
      isActive: entity.isActive,
      country: entity.country,
      deviceToken: entity.deviceToken,
      pointsExpireAt: startOfDay(
        addMilliseconds(
          entity.lastResetPointsAt,
          lifetimePointsConfig.lifetimeInMs,
        ),
      ),
    };
  }
}
