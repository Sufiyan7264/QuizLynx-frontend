import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { HalfCircle } from '../common/half-circle/half-circle';

@Component({
    selector: 'app-not-found',
    imports: [HalfCircle],
    standalone: true,
    templateUrl: './not-found.html',
    styleUrl: './not-found.scss'
})
export class NotFound {
    private readonly router = inject(Router);

    goHome() {
        this.router.navigate(['/dashboard']);
    }

    goSignIn() {
        this.router.navigate(['/signin']);
    }
}


