import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizAttemptService } from '../../core/service/quiz-attempt';
import { QuizResults } from '../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-student-attempts',
  imports: [
    CommonModule,
    FormsModule,
    InputText,
    Toast
  ],
  templateUrl: './student-attempts.html',
  styleUrl: './student-attempts.scss',
})
export class StudentAttempts implements OnInit {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly router = inject(Router);
  private readonly common = inject(Common);

  attempts: QuizResults[] = [];
  filteredAttempts: QuizResults[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadAttempts();
  }

  loadAttempts(): void {
    this.common.showSpinner();
    this.quizAttemptService.getStudentAttempts().subscribe({
      next: (attempts) => {
        // Sort by submitted date (most recent first)
        this.attempts = attempts.sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          return dateB - dateA;
        });
        this.applyFilters();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load attempts');
        this.common.hideSpinner();
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.attempts];

    // Filter by search term
    if (this.searchTerm?.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(attempt =>
        attempt.quizTitle?.toLowerCase().includes(search) ||
        attempt.quizId?.toLowerCase().includes(search)
      );
    }

    this.filteredAttempts = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  viewResult(attempt: QuizResults): void {
    if (attempt.id) {
      this.router.navigate(['/quiz/result', attempt.id]);
    } else if (attempt.quizId) {
      this.router.navigate(['/quiz/result', attempt.quizId]);
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(submittedAt?: any,startAt?:any): string {
    let seconds = Math.floor((new Date(submittedAt).getTime() - new Date(startAt).getTime()) / 1000);
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }
}
