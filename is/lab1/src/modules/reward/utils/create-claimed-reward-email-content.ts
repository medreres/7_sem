import { SendEmailParams } from '../../mailing/types/send-email.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { RewardEntity } from '../entities/reward.entity.js';

export const createClaimedRewardEmailContent = (
  reward: RewardEntity,
  user: UserEntity,
): SendEmailParams => {
  return {
    recipients: [user.email],
    subject: 'Congratulations! Your Reward Has Been Claimed 🎉',
    body: `
    <div>
      Hi ${user.firstName},
      <br /><br />
      We are excited to inform you that you have just unlocked a reward for reaching ${user.pointsAmount} points! &#127881;
      <br /><br />
      The reward you've claimed is:
      <br />
      <b>${reward.name}</b>
      <br /><br />
      This reward has been automatically claimed on your behalf, and you can now track its progress in your Rewards section within the app.
      <br /><br />
      <b>Current Status</b>: Claimed
      <br /><br />
      Once your reward has been shipped, we'll update the status to <b>Shipped</b> so you'll know when to expect it.
      <br /><br />
      Head over to the <b>Rewards Listing page</b> in the app to see your claimed reward's progress.
      <br /><br />
      Thank you for being a valued member of our community! &#127873;
      <br /><br />
      Best regards,
      <br />
      Hispec Team
    </div>
  `,
  };
};
