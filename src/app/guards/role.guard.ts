// Angular core imports
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// Service imports
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.authService.getUserType() === 'admin') {
            return true;
        }

        // Redirect to student dashboard instead of a non-existent '/dashboard' route
        this.router.navigate(['/student/dashboard']);
        return false;
    }
}
