import axios, {AxiosInstance} from 'axios'
import { IArticleUser } from '../dto/IArticleUser';

export class ArticleUserService {
    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addArticleUser = async (articleUser: IArticleUser): Promise<IArticleUser> => {
        const response = await this.axiosInstance.post<IArticleUser>("/users/"+articleUser.id_user+"/article_user", articleUser);
        return response.data;
    }

    getArticleUser(username:number, id_product:number) {
        return this.axiosInstance.get<IArticleUser>('/users/'+username+'article_user/'+id_product);
    }

    getArticlesUser(username:number) {
        return this.axiosInstance.get<IArticleUser[]>('/users/'+username+'/article_user');
    }

    getArticleUsers(id_product:number) {
        return this.axiosInstance.get<IArticleUser[]>('users/article_user/'+id_product);
    }

    updateArticleUser(articleUser: IArticleUser) {
        return this.axiosInstance.put<IArticleUser>('/article_user/'+articleUser.id_article_user, articleUser);
    }

    deleteArticleUser(id:number) {
        return this.axiosInstance.delete<IArticleUser>('/article_user/'+id);
    }


}