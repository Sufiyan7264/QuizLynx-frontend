import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizAttemptService } from '../../core/service/quiz-attempt';
import { QuizResults } from '../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-user-attempts',
  standalone: true,
  imports: [
    FormsModule,
    InputText,
  ],
  templateUrl: './user-attempts.html',
  styleUrl: './user-attempts.scss',
})
export class UserAttempts implements OnInit {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly router = inject(Router);
  private readonly common = inject(Common);

  attempts: QuizResults[] = [];
  filteredAttempts: QuizResults[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.attempts];
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

  formatTime(submittedAt?: any, startAt?: any): string {
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
    this.router.navigate(['/user-dashboard']);
  }
}


