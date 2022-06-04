import IToken from "./IToken";

export default interface IUser extends IToken{
    userId: string,
    login: string,
    surname: string;
    name: string;
    email: string;
    avatarUrl: string;
    createdAt: Date;
}