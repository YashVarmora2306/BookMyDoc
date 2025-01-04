export interface IDoctorPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: Buffer ;
    specialist: string;
    degree: string;
    experience: string;
    about: string;
    fees: number;
    address: object;
}

export interface IDoctorData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string;
    specialist: string;
    degree: string;
    experience: string;
    about: string;
    fees: number;
    address: object;
}

export interface IReplayFromDoctor { 
    status: string;
    message: string;
    data: object;
}