import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Admin, AdminResponse } from '../models/admin.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    // Get admin profile
    getAdminProfile(): Observable<AdminResponse> {
        return this.http.get<AdminResponse>(`${this.apiUrl}/profile`);
    }

    // Update admin profile
    updateAdminProfile(admin: Admin): Observable<AdminResponse> {
        return this.http.put<AdminResponse>(`${this.apiUrl}/profile`, admin);
    }

    // Change password
    changePassword(oldPassword: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/change-password`, {
            oldPassword,
            newPassword
        });
    }

    // Get dashboard statistics
    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard-stats`);
    }
}
