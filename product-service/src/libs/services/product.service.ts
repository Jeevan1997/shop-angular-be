import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { formatJSONResponse } from "@libs/api-gateway";


const client = new DynamoDBClient({region: "us-east-1"});
const docClient = DynamoDBDocumentClient.from(client);

export class ProductService {

    public getProductById = async (productId: string) => {
        const productsCommand = new GetCommand({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Key: {
                id: productId
            }
          });
        const productResponse = await docClient.send(productsCommand);
        const product = productResponse?.Item;

        if(product){
            const stocksCommand = new GetCommand({
                TableName: process.env.STOCKS_TABLE_NAME,
                Key: {
                    product_id: productId
                }
              });
            const stocksResponse = await docClient.send(stocksCommand);
            const stock = stocksResponse?.Item;
            const jointedList = { ...product, count: stock?.count || 0};
    
            return Promise.resolve(jointedList);
        }
        return product;
    };

    public getProducts = async () => {
        const productsCommand = new ScanCommand({
            TableName: process.env.PRODUCTS_TABLE_NAME,
          });
        const productResponse = await docClient.send(productsCommand);
        const products = productResponse?.Items;

        if(products){
            const stocksCommand = new ScanCommand({
                TableName: process.env.STOCKS_TABLE_NAME,
              });
            const stocksResponse = await docClient.send(stocksCommand);
            const stocks = stocksResponse?.Items;
            const jointedList = products.map((product) =>{
                const item = stocks.find(stock => stock.product_id === product.id);
                return { ... product, count: item?.count || 0};
            })
            return Promise.resolve(jointedList);
        }
        return products;
        
    }
}