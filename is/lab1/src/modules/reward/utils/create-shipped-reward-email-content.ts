import { UserEntity } from '../../user/entities/user.entity.js';
import { RewardEntity } from '../entities/reward.entity.js';
import { RewardEmailContent } from '../types/reward-email-content.js';

export const createShippedRewardEmailContent = (
  user: UserEntity,
  reward: RewardEntity,
): RewardEmailContent => {
  return {
    subject: 'Your Reward is on the Way! 🚚',
    body: `
    <div>
      Hi ${user.firstName},
      <br /><br />
      Good news! Your reward has been shipped and is on its way to you! &#127881;
      <br /><br />
      The reward you've claimed is:
      <br />
      <b>${reward.name}</b>
      <br /><br />
      You can expect to receive it soon. You can check the updated status in your <b>Rewards Listing page</b> within the app.
      <br /><br />
      <b>Current Status</b>: Shipped
      <br /><br />
      We hope you enjoy your reward, and thank you for your continued support!
      <br /><br />
      Best regards,
      <br />
      HispecTeam
    </div>
  `,
  };
};
