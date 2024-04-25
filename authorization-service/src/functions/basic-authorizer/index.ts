import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.basic-authorizer`,
  events: [
    {
      http: {
        method: 'get',
        path: 'authorize',
        cors: true,
      },
    },
  ],
};