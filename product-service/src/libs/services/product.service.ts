import { product } from "@libs/mock/product.mock";

export class ProductService {

    public getProductById = (productId: string) => {
        const data = product.find(({ id }) => id === productId);

        return Promise.resolve(data);
    };

    public getProducts = () => {
        return Promise.resolve(product);
    }
}