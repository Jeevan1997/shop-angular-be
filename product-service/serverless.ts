import { getProducts, getProductById, createProduct, catalogBatchProcess } from '@functions/index';
import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: 'products',
      STOCKS_TABLE_NAME: 'stocks',
      CREATE_PRODUCT_TOPIC_ARN: {
        Ref: 'createProductTopic'
      },
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: [
        'dynamodb:DescribeTable',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem'
      ],
      Resource: [
        'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/products',
        'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/stocks',
      ]
    },
    {
      Effect: 'Allow',
      Action: 'sns:Publish',
      Resource: {
        Ref: 'createProductTopic',
      },
    },
  ],
  },
  // import the function via paths
  functions: { getProducts, getProductById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      apiType: "http",
      basePath: "/dev",
    },
  },
  resources: {
    Resources: {
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic', 
        },
      },
      emailSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'reddysaijeevan@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
