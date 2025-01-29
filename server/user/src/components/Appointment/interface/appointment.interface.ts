export interface IAppointmentPayload {
    userId: string;
    doctorId: string;
    slotDate: string;
    slotTime: string;
}

export interface IReplayFromService {
    status: string;
    message: string;
    data: string;
}

export interface IUserData {
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

export interface IDoctorData {
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
    slots_booked?: object;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAppointment {
    userId: string;
    doctorId: string;
    userData: IUserData;
    doctorData: IDoctorData;
    slotDate: string;
    slotTime: string;
    amount: number;
    date: number;
}


export interface IAppointmentResponse {
    status: string;
    message: string;
    data: IAppointmentData[]
}

export interface IAppointmentData {

    id: string;
    userId: string;
    doctorId: string;
    slotDate: string;
    slotTime: string;
    userData: IUserData;
    doctorData: IDoctorData;
    amount: number;
    date: number;
    cancelled: boolean;
    payment: boolean;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}