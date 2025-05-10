import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        // Check if there's a saved login type
        const savedLoginType = localStorage.getItem('loginType');
        if (savedLoginType) {
            this.isAdminLogin = savedLoginType === 'admin';
        }
    }

    toggleLoginType(): void {
        this.isAdminLogin = !this.isAdminLogin;
        this.loginForm.reset();
        this.errorMessage = '';
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const { username, password, email } = this.loginForm.value;

            if (this.isAdminLogin) {
                this.authService.adminLogin(username, password).subscribe(
                    (response) => {
                        if (this.rememberMe) {
                            localStorage.setItem('loginType', 'admin');
                        }
                        this.router.navigate(['/admin/dashboard']);
                    },
                    (error) => {
                        this.errorMessage = 'Invalid admin credentials';
                    }
                );
            } else {
                this.authService.studentLogin(username, email).subscribe(
                    (response) => {
                        if (this.rememberMe) {
                            localStorage.setItem('loginType', 'student');
                        }
                        this.router.navigate(['/student/dashboard']);
                    },
                    (error) => {
                        this.errorMessage = 'Invalid student credentials';
                    }
                );
            }
        }
    }

    forgotPassword(): void {
        // Implement forgot password functionality
        this.router.navigate(['/forgot-password']);
    }
} 