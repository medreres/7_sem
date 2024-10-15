import { ActionContext, ActionHandler, ActionRequest } from 'adminjs';

import { ExtendedUser } from './types.js';
import { USER_RESOURCE_ID } from './user.resource.js';

import { createUser } from '../../../api/createUser.js';
import { handleErrors } from '../../../utils/errors/handle-errors.js';
import { hasErrors } from '../../../utils/errors/has-errors.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- adminjs types
export const handleNew: ActionHandler<any> = async (
  request: ActionRequest,
  _response,
  context: ActionContext,
) => {
  const { h } = context;

  const user = request.payload as ExtendedUser;
  const response = await createUser(request, user);

  if (!hasErrors(response)) {
    return {
      notice: {
        message: 'User has been created successfully!',
        type: 'success',
      },
      record: {
        params: response,
      },
      redirectUrl: h.listUrl(USER_RESOURCE_ID),
    };
  }

  // * if we create new user write password error to virtual newPassword field
  if (response.errors.password) {
    response.errors.newPassword = response.errors.password;
  }

  return handleErrors(response);
};
