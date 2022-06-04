import IUser from "./IUser";

export default interface AuthResponse {
    status: number,
    body: {
        accessToken:string,
        refreshToken:string,
        user: IUser
    }
}