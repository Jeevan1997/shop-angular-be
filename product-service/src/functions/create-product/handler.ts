import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { ProductService } from '@libs/services/product.service';
import { CreateProductSchema } from '@libs/validators/product-schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  console.log('Received event:', JSON.stringify(event, null, 2));
  const productData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const { error } = CreateProductSchema.validate(productData);
  if (error) {
    console.error('Validation error:', error.details);
    return formatJSONResponse({ statusCode:400, error: "Invalid request body" });
  }

  console.log('Parsed and validated product data:', productData);
  const productService = new ProductService();
  try{
    console.log('Attempting to create product and stock...');
    const product = await productService.createProduct(productData);
    if(!product){
      return formatJSONResponse({ statusCode:400, error: "Error in creating a product" });
    }
    else{
      return formatJSONResponse({message: "product creation done"});
    }  
  }catch(err){
    return formatJSONResponse({ statusCode:500, error: 'Failed to create product' });
  }
};

export const main = middyfy(createProduct);
