export interface Admin {
    id: number;
    username: string;
    password: string;
}

export interface AdminResponse {
    success: boolean;
    data: Admin;
    message?: string;
    token?: string;
}
