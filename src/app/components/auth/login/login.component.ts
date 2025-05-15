// Angular core imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
// Service imports
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isAdminLogin = false;
    rememberMe = false;
    errorMessage = '';
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        // Check if there's a saved login type
        const savedLoginType = localStorage.getItem('loginType');
        if (savedLoginType) {
            this.isAdminLogin = savedLoginType === 'admin';
            this.updateFormValidation();
        }
    }

    createForm(): void {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', this.isAdminLogin ? Validators.required : Validators.nullValidator],
            email: ['', this.isAdminLogin ? Validators.nullValidator : [Validators.required, Validators.email]]
        });
    }

    updateFormValidation(): void {
        const passwordControl = this.loginForm.get('password');
        const emailControl = this.loginForm.get('email');
        
        if (this.isAdminLogin) {
            passwordControl.setValidators(Validators.required);
            emailControl.clearValidators();
        } else {
            passwordControl.clearValidators();
            emailControl.setValidators([Validators.required, Validators.email]);
        }
        
        passwordControl.updateValueAndValidity();
        emailControl.updateValueAndValidity();
    }

    toggleLoginType(): void {
        this.isAdminLogin = !this.isAdminLogin;
        this.loginForm.reset();
        this.errorMessage = '';
        this.updateFormValidation();
    }

    onSubmit(): void {
        if (this.loginForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const { username, password, email } = this.loginForm.value;

            if (this.isAdminLogin) {
                this.authService.adminLogin(username, password).subscribe(
                    (response) => {
                        if (this.rememberMe) {
                            localStorage.setItem('loginType', 'admin');
                        }
                        this.router.navigate(['/admin/dashboard']);
                        this.isSubmitting = false;
                    },
                    (error) => {
                        this.errorMessage = 'Invalid admin credentials';
                        this.isSubmitting = false;
                    }
                );
            } else {
                this.authService.studentLogin(username, email).subscribe(
                    (response) => {
                        if (this.rememberMe) {
                            localStorage.setItem('loginType', 'student');
                        }
                        this.router.navigate(['/student/dashboard']);
                        this.isSubmitting = false;
                    },
                    (error) => {
                        this.errorMessage = 'Invalid student credentials';
                        this.isSubmitting = false;
                    }
                );
            }
        }
    }

    forgotPassword(event: Event): void {
        event.preventDefault();
        this.router.navigate(['/forgot-password']);
    }
}