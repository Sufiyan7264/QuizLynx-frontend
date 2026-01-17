import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './about.html',
    styleUrl: './about.scss'
})
export class About {
    values = [
        {
            icon: 'pi pi-heart',
            title: 'Student-First Design',
            description: 'Every feature is built with learners in mind. We believe education should be accessible, engaging, and effective.'
        },
        {
            icon: 'pi pi-bolt',
            title: 'Innovation Through AI',
            description: 'We harness the power of artificial intelligence to make quiz creation effortless and learning more personalized.'
        },
        {
            icon: 'pi pi-shield',
            title: 'Privacy & Trust',
            description: 'Your data belongs to you. We maintain the highest standards of security and never sell your information.'
        },
        {
            icon: 'pi pi-globe',
            title: 'Global Community',
            description: 'QuizLynx connects educators and learners worldwide, fostering a community of continuous improvement.'
        }
    ];
}
