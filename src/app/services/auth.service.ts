import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

    // Admin login
    adminLogin(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/login`, { username, password })
            .pipe(map(response => {
                if (response['token']) {
                    localStorage.setItem('token', response['token']);
                    localStorage.setItem('userType', 'admin');
                }
                return response;
            }));
    }

    // Student login
    studentLogin(id: string, email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/student/login`, { id, email })
            .pipe(map(response => {
                if (response['token']) {
                    localStorage.setItem('token', response['token']);
                    localStorage.setItem('userType', 'student');
                }
                return response;
            }));
    }

    // Student registration
    studentRegister(studentData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/student/register`, studentData);
    }

    // Logout
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
    }

    // Check if user is logged in
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    // Get user type
    getUserType(): string {
        return localStorage.getItem('userType') || '';
    }

    // Get token
    getToken(): string {
        return localStorage.getItem('token') || '';
    }
}
