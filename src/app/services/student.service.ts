import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Student, StudentResponse } from '../models/student.model';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private apiUrl = `${environment.apiUrl}/students`;

    constructor(private http: HttpClient) { }

    // Get all students
    getAllStudents(): Observable<StudentResponse> {
        return this.http.get<StudentResponse>(this.apiUrl);
    }

    // Get student by ID
    getStudentById(id: number): Observable<StudentResponse> {
        return this.http.get<StudentResponse>(`${this.apiUrl}/${id}`);
    }

    // Create new student
    createStudent(student: Student): Observable<StudentResponse> {
        return this.http.post<StudentResponse>(this.apiUrl, student);
    }

    // Update student
    updateStudent(id: number, student: Student): Observable<StudentResponse> {
        return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, student);
    }

    // Delete student
    deleteStudent(id: number): Observable<StudentResponse> {
        return this.http.delete<StudentResponse>(`${this.apiUrl}/${id}`);
    }

    // Upload profile picture
    uploadProfilePicture(id: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('profilePicture', file);
        return this.http.post(`${this.apiUrl}/${id}/profile-picture`, formData);
    }

    // Get similar surnames count
    getSimilarSurnamesCount(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/similar-surnames`);
    }

    // Get total students count
    getTotalStudentsCount(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
    }
}
