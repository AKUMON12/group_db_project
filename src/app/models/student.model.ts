export interface Student {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string;
    username?: string;
    password?: string;
}

export interface StudentResponse {
    success: boolean;
    data: Student | Student[];
    message?: string;
}
