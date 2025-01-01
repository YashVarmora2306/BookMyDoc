export interface IAdmin{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface ILoginResponse{
    data: {
        token: string;
        admin: IAdmin;
    };
}

export type LoginResponse = ILoginResponse;