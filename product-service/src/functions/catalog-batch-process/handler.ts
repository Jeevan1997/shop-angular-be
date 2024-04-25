import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { ProductService } from '@libs/services/product.service';
import middy from '@middy/core';
import { Handler, SQSEvent } from 'aws-lambda';

const catalogBatchProcess: Handler = async (event: SQSEvent) => {

  const sns = new SNSClient({ region: 'us-east-1' });
  const productService = new ProductService();

  for (const record of event.Records) {
    const product = JSON.parse(record.body);
    const createdProduct = await productService.createProduct(product);

    const message = `Product created: ${createdProduct.id} ${createdProduct.title}`;

    const params = {
      Message: message,
      Subject: 'Product Created',
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
    };
    await sns.send(new PublishCommand(params));
  }
};

export const main = middy(catalogBatchProcess);