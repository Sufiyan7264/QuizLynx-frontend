import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/service/quiz';
import { Quiz } from '../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
// import { Toast } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from '../../core/service/auth';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-student-quizzes',
  imports: [
    FormsModule,
    RouterModule,
    InputText,
    // Toast
  ],
  templateUrl: './student-quizzes.html',
  styleUrl: './student-quizzes.scss',
  // providers: [MessageService]
})
export class StudentQuizzes implements OnInit {
  private readonly quizService = inject(QuizService);
  // private readonly messageService = inject(MessageService);
  private common = inject(Common);
  private readonly router = inject(Router);
  private readonly authService = inject(Auth);

  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.common.showSpinner();
    // Get quizzes for all batches the student is enrolled in
    // For now, we'll get all published quizzes
    // You may need to adjust this based on your API
    this.quizService.getQuizzes().subscribe({
      next: (quizzes) => {
        // Filter only published quizzes
        this.quizzes = quizzes.filter(q => q.status === 'PUBLISHED');
        this.filteredQuizzes = [...this.quizzes];
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        this.common.showMessage(
          'error',
           'Error',
           error?.error?.message || 'Failed to load quizzes'
        );
        this.common.hideSpinner();
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredQuizzes = [...this.quizzes];
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredQuizzes = this.quizzes.filter(quiz =>
      quiz.title?.toLowerCase().includes(search) ||
      quiz.description?.toLowerCase().includes(search) ||
      quiz.subject?.toLowerCase().includes(search)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredQuizzes = [...this.quizzes];
  }

  startQuiz(quizId?: string): void {
    if (quizId) {
      this.router.navigate(['/quiz/attempt', quizId]);
    }
  }

  viewResult(quizId?: string): void {
    if (quizId) {
      this.router.navigate(['/quiz/result', quizId]);
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isQuizAvailable(quiz: Quiz): boolean {
    if (!quiz.startDate || !quiz.endDate) return true;
    const now = new Date();
    const start = new Date(quiz.startDate);
    const end = new Date(quiz.endDate);
    return now >= start && now <= end;
  }

  isQuizOverdue(quiz: Quiz): boolean {
    if (!quiz.dueDate) return false;
    const now = new Date();
    const due = new Date(quiz.dueDate);
    return now > due;
  }
}

