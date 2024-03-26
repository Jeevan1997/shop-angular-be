import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { ProductService } from '@libs/services/product.service';

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  
  const productService = new ProductService();
  const productList = await productService.getProducts();
  if(!productList){
    return formatJSONResponse({ error: "Products not found" });
  }
  else{
    return formatJSONResponse({productList});
  }  
};

export const main = middyfy(getProducts);
