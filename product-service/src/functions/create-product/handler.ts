import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { ProductService } from '@libs/services/product.service';
import { FromSchema } from 'json-schema-to-ts';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  
  const body: FromSchema<typeof schema> = event.body;

  if (!body) {
    return formatJSONResponse({ error: "Missing body" });
  }

  const productService = new ProductService();
  const product = await productService.createProduct(body);
  if(!product){
    return formatJSONResponse({ error: "Error in creating a product" });
  }
  else{
    return formatJSONResponse({message: "product creation done"});
  }  
};

export const main = middyfy(createProduct);
