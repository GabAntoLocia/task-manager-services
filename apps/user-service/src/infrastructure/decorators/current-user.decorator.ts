import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const requestData = context.switchToRpc().getData();
    const user = requestData.user;

    if (data === 'refreshToken') {
      return requestData.refreshToken;
    }

    return data ? user?.[data] : user;
  },
);