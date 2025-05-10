import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
            password: ['', [
                Validators.required,
                Validators.minLength(12),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{12,}$')
            ]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    ngOnInit(): void {
        // Check if user is already logged in
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
        }
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
        }
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            const formData = this.registerForm.value;
            delete formData.confirmPassword;

            this.authService.studentRegister(formData).subscribe(
                (response) => {
                    this.successMessage = 'Registration successful! Please login.';
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                },
                (error) => {
                    this.errorMessage = error.error.message || 'Registration failed. Please try again.';
                }
            );
        }
    }

    getErrorMessage(controlName: string): string {
        const control = this.registerForm.get(controlName);
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
            if (controlName === 'phoneNumber') {
                return 'Please enter a valid 11-digit phone number';
            }
            if (controlName === 'password') {
                return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            }
        }

        if (control.hasError('passwordMismatch')) {
            return 'Passwords do not match';
        }

        return '';
    }
} 