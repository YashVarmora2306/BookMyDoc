export interface IUserData{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IUser{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string;
    address: object;
    gender: string;
    dob: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface ILoginResponse {
    data: {
        token: string;
        doctor: IUser;
    };
}

export type LoginResponse = ILoginResponse;