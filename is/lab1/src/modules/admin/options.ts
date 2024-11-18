import { AdminJSOptions } from 'adminjs';

import { componentLoader, components } from './components/index.js';
import resources from './resources/index.js';

import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { ClaimEntity } from '../reward/entities/claim.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';

export const adminOptions: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: resources.map((resource) => resource()),
  branding: {
    companyName: 'IPS-41',
    logo: 'https://www.google.com/u/0/ac/images/logo.gif?uid=100029193258489271529&service=google_gsuite',
    favicon:
      'https://lh5.googleusercontent.com/proxy/5rC6f4VPyTT0ObNLggYn48Jg60BEh60qPWZAt4n7nKplWHPxrOe5M-F82iyRuGRUhhs-FkO-SlLwsrY-bxA2htE7tD9rzA6xsHnrAN_Z5jsxiOlVYx9NCUuq',
  },
  dashboard: {
    handler: async () => {
      const pointRepository = PointTransactionEntity.getRepository();
      const claimRepository = ClaimEntity.getRepository();
      const userRepository = UserEntity.getRepository();

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
