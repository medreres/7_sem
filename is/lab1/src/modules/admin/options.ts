// @ts-nocheck
import { AdminJSOptions } from 'adminjs';

import { componentLoader, components } from './components/index.js';
import resources from './resources/index.js';

import { OrderEntity } from '../order/enttities/order.entity.js';
import { OrderItemEntity } from '../order/enttities/order-item.entity.js';
import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { ClaimEntity } from '../reward/entities/claim.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';

export const adminOptions: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: resources.map((resource) => resource()),
  branding: {
    withMadeWithLove: false,
    companyName: 'КН-2325Б',
    favicon: 'https://dspu.edu.ua/wp-content/uploads/2020/02/gerb.png',
  },
  assets: {
    styles: [''], // here you can hide the default images and re-position the boxes or text.
  },
  dashboard: {
    handler: async () => {
      const pointRepository = PointTransactionEntity.getRepository();
      const claimRepository = ClaimEntity.getRepository();
      const userRepository = UserEntity.getRepository();
      const orderRepository = OrderEntity.getRepository();
      const orderItemRepository = OrderItemEntity.getRepository();

      // Fetch average points per day
      const pointsData = await pointRepository
        .createQueryBuilder('transaction')
        .select('DATE(transaction.createdAt)', 'date')
        .addSelect('AVG(transaction.amount)', 'averagePoints')
        .groupBy('DATE(transaction.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany();

      // Fetch user status percentages
      const userStatuses = await userRepository
        .createQueryBuilder('user')
        .select('status.name', 'statusName')
        .addSelect(
          'COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user)',
          'percentage',
        )
        .innerJoin('user.status', 'status')
        .groupBy('status.name')
        .getRawMany();

      // Fetch claims count per day
      const claimsData = await claimRepository
        .createQueryBuilder('claim')
        .select('DATE(claim.createdAt)', 'date')
        .addSelect('COUNT(*)', 'claimCount')
        .groupBy('DATE(claim.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany();

      return {
        userStatusChartData: {
          labels: userStatuses.map((entry) => entry.statusName),
          percentages: userStatuses.map((entry) =>
            parseFloat(entry.percentage),
          ),
        },
        pointsChartData: {
          labels: pointsData.map((entry) => entry.date),
          averages: pointsData.map((entry) => parseFloat(entry.averagePoints)),
        },
        claimsChartData: {
          labels: claimsData.map((entry) => entry.date),
          counts: claimsData.map((entry) => parseInt(entry.claimCount, 10)),
        },
      };
    },

    component: components.Dashboard,
  },
  // pages: {
  //   dashboard: {
  //     component: components.Dashboard,
  //   },
  // },
};
