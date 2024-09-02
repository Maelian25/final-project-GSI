import axios, {AxiosInstance} from 'axios'
import { IUser } from '../dto/IUser';

export class UserService {
    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    checkUser = async (username: string, password: string): Promise<Boolean> => {
        const response = await this.axiosInstance.post("login", {username, password});
        return response.status === 200;
    }

    addUser = async (user: IUser): Promise<IUser> => {
        const response = await this.axiosInstance.post<IUser>("users", user);
        return response.data;
    }

    getUser(username:string) {
        return this.axiosInstance.get<IUser>('users/'+username);
    }

    getUsers() {
        return this.axiosInstance.get<IUser[]>('users/');
    }

    updateUser(user: IUser) {
        return this.axiosInstance.put<IUser>('/users/'+user.username, user);
    }

    deleteUser(username:string) {
        return this.axiosInstance.delete<IUser>('/users/'+username);
    }

}