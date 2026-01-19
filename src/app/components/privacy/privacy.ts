import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-privacy',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './privacy.html',
    styleUrl: './privacy.scss'
})
export class Privacy {
    lastUpdated = 'January 2025';
}
