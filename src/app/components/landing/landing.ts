import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  private readonly router = inject(Router);

  stats = [
    { value: '10K+', label: 'Active Learners' },
    { value: '500+', label: 'Tech Quizzes' },
    { value: '50+', label: 'Countries' },
    { value: '4.9', label: 'User Rating' }
  ];

  studentFeatures = [
    'Access thousands of tech quizzes',
    'Track progress with detailed analytics',
    'Compete on global leaderboards',
    'Join private classroom batches'
  ];

  instructorFeatures = [
    'Create custom quizzes for your students',
    'Manage private batches',
    'Monitor student performance in real-time',
    'Export detailed reports'
  ];

  tryQuizlynx() {
    this.router.navigate(['/signin']);
  }

  register() {
    this.router.navigate(['/register']);
  }
}