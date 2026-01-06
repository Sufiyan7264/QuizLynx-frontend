import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface RoleOption {
  key: 'STUDENT' | 'INSTRUCTOR' | 'USER';
  title: string;
  description: string;
  benefits: string[];
  primaryRoute: string;
}

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './select-role.html',
  styleUrl: './select-role.scss',
})
export class SelectRole {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // In a real app, consider pulling from environment.ts
  private apiUrl = 'https://localhost:8080/auth/complete-oauth-registration';

  roleOptions: RoleOption[] = [
    {
      key: 'USER',
      title: 'Independent Learner',
      description: 'Learn solo, generate practice sets, and track personal progress.',
      benefits: ['Explore library', 'Create custom quizzes', 'View personal analytics'],
      primaryRoute: '/user-dashboard',
    },
    {
      key: 'STUDENT',
      title: 'Student',
      description: 'Join classes, take assigned quizzes, and review attempts.',
      benefits: ['Join class', 'Attempt quizzes', 'See results & feedback'],
      primaryRoute: '/student-dashboard',
    },
    {
      key: 'INSTRUCTOR',
      title: 'Instructor',
      description: 'Create quizzes, manage batches, and track learner performance.',
      benefits: ['Create quizzes', 'Manage batches', 'View analytics'],
      primaryRoute: '/dashboard',
    },
  ];

  selectRole(role: RoleOption) {
    if (this.isSubmitting()) return;
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const payload = { role: role.key };

    this.http.patch(this.apiUrl, payload, { withCredentials: true }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate([role.primaryRoute]);
      },
      error: (err: any) => {
        console.error('Error selecting role:', err);
        this.errorMessage.set('Something went wrong. Please try again.');
        this.isSubmitting.set(false);
      },
    });
  }
}
