import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: "arn:aws:sqs:us-east-1:934023437220:catalogItemsQueue"
      },
    },
  ],
};