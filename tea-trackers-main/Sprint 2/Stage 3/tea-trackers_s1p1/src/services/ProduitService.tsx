import axios, {AxiosInstance} from 'axios'
import { IProduct } from '../dto/IProduct';

export class ProductService {
    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addProduct = async (product: IProduct): Promise<IProduct> => {
        const response = await this.axiosInstance.post<IProduct>("/products", product);
        return response.data;
    }

    getProduct(id:number) {
        return this.axiosInstance.get<IProduct>('/products/'+id);
    }

    getProducts() {
        return this.axiosInstance.get<IProduct[]>('/products');
    }

    updateProduct(product: IProduct) {
        return this.axiosInstance.put<IProduct>('/products/'+product.id_product, product);
    }

    deleteProduct(id:number) {
        return this.axiosInstance.delete<IProduct>('/products/'+id);
    }

    searchProducts(search:string) {
        return this.axiosInstance.get<IProduct[]>('/produit/search?query='+search);
    }

    searchProductsByCas(search:string, fabricant:string = "") {
        return this.axiosInstance.get<IProduct[]>('/produit/search/by_cas?query='+search+'&fabricant='+fabricant);
    }

    searchProductsByName(search:string, fabricant:string = "") {
        return this.axiosInstance.get<IProduct[]>('/produit/search/by_name?query='+search+'&fabricant='+fabricant);
    }

    searchProductsByFormula(search:string, fabricant:string = "") {
        return this.axiosInstance.get<IProduct[]>('/produit/search/by_formula?query='+search+'&fabricant='+fabricant);
    }

    searchProductsBySmiles(search:string, fabricant:string = "") {
        return this.axiosInstance.get<IProduct[]>('/produit/search/by_smiles?query='+search+'&fabricant='+fabricant);
    }
    

    
}