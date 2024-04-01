import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { ProductService } from '@libs/services/product.service';
import { APIGatewayProxyEvent } from 'aws-lambda';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: Pick<APIGatewayProxyEvent, 'pathParameters'>) => {
  
  const id = event.pathParameters?.id;

  if (!id) {
    return formatJSONResponse({ error: "Missing id" });
  }

  const productService = new ProductService();
  const product = await productService.getProductById(id);
  if(!product){
    return formatJSONResponse({ error: "Products not found" });
  }
  else{
    return formatJSONResponse({product});
  }  
};

export const main = middyfy(getProductById);
