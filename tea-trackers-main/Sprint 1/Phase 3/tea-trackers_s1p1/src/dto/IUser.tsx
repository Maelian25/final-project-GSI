export interface IUser {
    id_user: number;
    username: string;
    password: string;
    mail: string;
    hashed_password: string;
    password_salt: string;
    user_type: string;
    localisation: string;
}