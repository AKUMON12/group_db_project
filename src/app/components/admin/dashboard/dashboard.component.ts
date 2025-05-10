import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    students: Student[] = [];
    totalStudents = 0;
    similarSurnames = 0;
    searchTerm = '';
    selectedStudent: Student | null = null;
    showAddModal = false;
    showEditModal = false;
    showDeleteModal = false;

    constructor(private studentService: StudentService) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        // Load students
        this.studentService.getAllStudents().subscribe(
            (response) => {
                if (response.success) {
                    this.students = response.data as Student[];
                }
            }
        );

        // Load total students count
        this.studentService.getTotalStudentsCount().subscribe(
            (response) => {
                this.totalStudents = response.count;
            }
        );

        // Load similar surnames count
        this.studentService.getSimilarSurnamesCount().subscribe(
            (response) => {
                this.similarSurnames = response.count;
            }
        );
    }

    searchStudents(): void {
        if (this.searchTerm.trim()) {
            // Implement search logic
            this.students = this.students.filter(student =>
                student.id.toString().includes(this.searchTerm) ||
                student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        } else {
            this.loadDashboardData();
        }
    }

    openAddModal(): void {
        this.showAddModal = true;
    }

    openEditModal(student: Student): void {
        this.selectedStudent = { ...student };
        this.showEditModal = true;
    }

    openDeleteModal(student: Student): void {
        this.selectedStudent = student;
        this.showDeleteModal = true;
    }

    closeModals(): void {
        this.showAddModal = false;
        this.showEditModal = false;
        this.showDeleteModal = false;
        this.selectedStudent = null;
    }

    addStudent(student: Student): void {
        this.studentService.createStudent(student).subscribe(
            (response) => {
                if (response.success) {
                    this.loadDashboardData();
                    this.closeModals();
                }
            }
        );
    }

    updateStudent(student: Student): void {
        if (this.selectedStudent) {
            this.studentService.updateStudent(this.selectedStudent.id, student).subscribe(
                (response) => {
                    if (response.success) {
                        this.loadDashboardData();
                        this.closeModals();
                    }
                }
            );
        }
    }

    deleteStudent(): void {
        if (this.selectedStudent) {
            this.studentService.deleteStudent(this.selectedStudent.id).subscribe(
                (response) => {
                    if (response.success) {
                        this.loadDashboardData();
                        this.closeModals();
                    }
                }
            );
        }
    }
} 