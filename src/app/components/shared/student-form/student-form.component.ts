import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../../models/student.model';

@Component({
    selector: 'app-student-form',
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
    @Input() student: Student | null = null;
    @Output() submit = new EventEmitter<Student>();
    @Output() cancel = new EventEmitter<void>();

    studentForm: FormGroup;
    profilePicture: File | null = null;
    previewUrl: string | null = null;

    constructor(private fb: FormBuilder) {
        this.studentForm = this.fb.group({
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]]
        });
    }

    ngOnInit(): void {
        if (this.student) {
            this.studentForm.patchValue(this.student);
            this.previewUrl = this.student.profilePicture || null;
        }
    }

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.profilePicture = file;
            this.createPreviewUrl(file);
        }
    }

    createPreviewUrl(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    onSubmit(): void {
        if (this.studentForm.valid) {
            const formData = this.studentForm.value;
            if (this.profilePicture) {
                formData.profilePicture = this.profilePicture;
            }
            this.submit.emit(formData);
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    getErrorMessage(controlName: string): string {
        const control = this.studentForm.get(controlName);
        if (!control) return '';

        if (control.hasError('required')) {
            return 'This field is required';
        }

        if (control.hasError('email')) {
            return 'Please enter a valid email address';
        }

        if (control.hasError('minlength')) {
            return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
        }

        if (control.hasError('pattern')) {
            return 'Please enter a valid 11-digit phone number';
        }

        return '';
    }
} 