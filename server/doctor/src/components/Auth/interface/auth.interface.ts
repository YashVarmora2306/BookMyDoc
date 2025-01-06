export interface IDoctor{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string;
    specialist: string;
    degree: string;
    experience: string;
    about: string;
    available: boolean;
    fees: number;
    address: object;
    slots_booked: object;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface ILoginResponse{
    data: {
        token: string;
        doctor: IDoctor;
    };
}

export type LoginResponse = ILoginResponse;