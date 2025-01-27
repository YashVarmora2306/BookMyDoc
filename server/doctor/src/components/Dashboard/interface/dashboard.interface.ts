export interface IDashData{
    earnings: number;
    appointments: number;
    patients: number;
    latestAppointments:object
}

export interface IReplay {
    status: string;
    message: string;
    data: string;
}

type reply = {
    status: string;
    message: string;
    data: object[];
}


export interface IPatients{
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

export interface iGetDashboardServiceResponse {
    earnings: number;
    patients: IPatients[];
    appointments: reply;
}