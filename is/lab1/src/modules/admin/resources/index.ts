import { createAttachmentResource } from './attachment.resource.js';
import { createLogResource } from './log/log.resource.js';
import products from './product/index.js';
import rewards from './rewards/index.js';
import users from './user/index.js';

export default [
  users,
  rewards,
  products,
  createAttachmentResource,
  createLogResource,
].flat();
