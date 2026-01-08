import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/service/quiz';
import { BatchService } from '../../core/service/batch';
import { Quiz, Batch } from '../../core/interface/interfaces';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-batch-quizzes',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './batch-quizzes.html',
  styleUrl: './batch-quizzes.scss'
})
export class BatchQuizzes implements OnInit {
  private readonly quizService = inject(QuizService);
  private readonly batchService = inject(BatchService);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly common = inject(Common);

  batchId?: string;
  batch?: Batch;
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.batchId = this.route.snapshot.params['batchId'];
    if (this.batchId) {
      this.loadBatch();
      this.loadQuizzes();
    }
  }

  goBack(): void {
    this.router.navigate(['/student/batches']);
  }

  loadBatch(): void {
    if (!this.batchId) return;
    this.batchService.getBatchByIdForStudent(this.batchId).subscribe({
      next: (batch) => {
        this.batch = batch;
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load batch');
      }
    });
  }

  loadQuizzes(): void {
    if (!this.batchId) return;
    this.common.showSpinner();
    this.quizService.getQuizzesByBatch(this.batchId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.applyFilters();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load quizzes');
        this.common.hideSpinner();
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.quizzes];

    // Filter by search term
    if (this.searchTerm?.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(quiz =>
        quiz.title?.toLowerCase().includes(search) ||
        quiz.description?.toLowerCase().includes(search) ||
        quiz.subject?.toLowerCase().includes(search)
      );
    }

    this.filteredQuizzes = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  attemptQuiz(quiz: Quiz): void {
    if (quiz.id) {
      this.router.navigate(['/quiz/attempt', quiz.id]);
    }
  }

  viewResults(quiz: Quiz): void {
    if (quiz.id) {
      this.router.navigate(['/quiz/result', quiz.id]);
    }
  }

  formatDisplayDate(dateString?: string): string {
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

  getStatusClass(status?: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'CLOSED':
        return 'px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  }

  isQuizAvailable(quiz: Quiz): boolean {
    if (!quiz.startDate && !quiz.endDate) return true;
    const now = new Date();
    if (quiz.startDate && new Date(quiz.startDate) > now) return false;
    if (quiz.endDate && new Date(quiz.endDate) < now) return false;
    return true;
  }

  isQuizOverdue(quiz: Quiz): boolean {
    if (!quiz.dueDate) return false;
    return new Date(quiz.dueDate) < new Date();
  }
}

