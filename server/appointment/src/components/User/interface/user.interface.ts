export interface IUserData{
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

export interface IAppointmentData { 
    userId: string;
    doctorId: string;
    userData: IUserData;
    doctorData: IDoctorData;
    slotDate: string;
    slotTime: string;
    amount: number;
    date: number;
}