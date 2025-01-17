export interface IDashData{
    doctors: number;
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

export interface iGetDashboardServiceResponse{
    doctors: reply;
    patients: reply;
    appointments: reply;
}