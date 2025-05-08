import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
    selector: 'app-student-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    student: Student | null = null;
    isEditing = false;
    notepadContent = '';
    wordCount = 0;
    profilePicture: File | null = null;
    previewUrl: string | null = null;

    constructor(private studentService: StudentService) { }

    ngOnInit(): void {
        this.loadStudentData();
        this.loadNotepadContent();
    }

    loadStudentData(): void {
        // Get student ID from auth service or route params
        const studentId = 1; // Replace with actual student ID
        this.studentService.getStudentById(studentId).subscribe(
            (response) => {
                if (response.success) {
                    this.student = response.data as Student;
                    this.previewUrl = this.student.profilePicture || null;
                }
            }
        );
    }

    loadNotepadContent(): void {
        const savedContent = localStorage.getItem('notepadContent');
        if (savedContent) {
            this.notepadContent = savedContent;
            this.updateWordCount();
        }
    }

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file && this.student) {
            this.profilePicture = file;
            this.createPreviewUrl(file);
            this.uploadProfilePicture();
        }
    }

    createPreviewUrl(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    uploadProfilePicture(): void {
        if (this.profilePicture && this.student) {
            this.studentService.uploadProfilePicture(this.student.id, this.profilePicture).subscribe(
                (response) => {
                    if (response.success) {
                        // Update student profile picture
                        this.student!.profilePicture = response.data.profilePicture;
                    }
                }
            );
        }
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
    }

    saveProfile(): void {
        if (this.student) {
            this.studentService.updateStudent(this.student.id, this.student).subscribe(
                (response) => {
                    if (response.success) {
                        this.isEditing = false;
                    }
                }
            );
        }
    }

    onNotepadChange(): void {
        this.updateWordCount();
        this.saveNotepadContent();
    }

    updateWordCount(): void {
        this.wordCount = this.notepadContent.trim().split(/\s+/).length;
    }

    saveNotepadContent(): void {
        localStorage.setItem('notepadContent', this.notepadContent);
    }

    clearNotepad(): void {
        this.notepadContent = '';
        this.updateWordCount();
        this.saveNotepadContent();
    }

    saveNotepadAsText(): void {
        const blob = new Blob([this.notepadContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notepad.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    formatText(command: string): void {
        document.execCommand(command, false);
    }
} 