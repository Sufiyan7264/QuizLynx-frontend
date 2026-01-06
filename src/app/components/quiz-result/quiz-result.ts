import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizAttemptService } from '../../core/service/quiz-attempt';
import { QuizResults, QuestionReview } from '../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { Common } from '../../core/common/common';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-quiz-result',
  imports: [
    CommonModule,
    Button,
    // Toast
  ],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.scss',
  // providers: [MessageService]
})
export class QuizResult implements OnInit {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly common = inject(Common);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  resultId?: string;
  quizId?: string;
  result?: QuizResults;

  ngOnInit(): void {
    this.resultId = this.route.snapshot.params['id'];
    this.quizId = this.route.snapshot.params['quizId'];
    
    if (this.resultId) {
      this.loadResult();
    } else if (this.quizId) {
      this.loadResultByQuizId();
    } else {
      this.router.navigate(['/student-dashboard']);
    }
  }

  loadResult(): void {
    if (!this.resultId) return;
    this.common.showSpinner();
    this.quizAttemptService.getQuizResult(this.resultId).subscribe({
      next: (result) => {
        this.result = result;
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading result:', error);
        this.common.showMessage(
'error','Error',error?.error?.message || 'Failed to load result'
        );
        this.common.hideSpinner();
        this.router.navigate(['/student-dashboard']);
      }
    });
  }

  loadResultByQuizId(): void {
    if (!this.quizId) return;
    this.common.showSpinner();
    this.quizAttemptService.getQuizResultByQuizId(this.quizId).subscribe({
      next: (result) => {
        this.result = result;
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading result:', error);
        this.common.showMessage(
'error','Error',error?.error?.message || 'Failed to load result'
        );
        this.common.hideSpinner();
        this.router.navigate(['/student-dashboard']);
      }
    });
  }

  get percentage(): number {
    return this.result?.percentage || 0;
  }

  get passed(): boolean {
    return this.result?.passed || false;
  }

  get scoreColor(): string {
    if (this.percentage >= 80) return 'success';
    if (this.percentage >= 60) return 'warning';
    return 'danger';
  }

  get scoreMessage(): string {
    if (this.percentage >= 90) return 'Outstanding!';
    if (this.percentage >= 80) return 'Excellent!';
    if (this.percentage >= 70) return 'Good job!';
    if (this.percentage >= 60) return 'Well done!';
    if (this.percentage >= 50) return 'Keep practicing!';
    return 'Try again!';
  }

  get timeTaken(): string {
    if (!this.result?.timeTaken) {
      // Calculate from startedAt and submittedAt if timeTaken not provided
      if (this.result?.startedAt && this.result?.submittedAt) {
        const start = new Date(this.result.startedAt).getTime();
        const end = new Date(this.result.submittedAt).getTime();
        const seconds = Math.floor((end - start) / 1000);
        return this.formatTime(seconds);
      }
      return 'N/A';
    }
    return this.formatTime(this.result.timeTaken);
  }

  formatTime(seconds: number): string {
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

  get questionReviews(): QuestionReview[] {
    if (!this.result?.questionReviews) return [];
    return this.result.questionReviews.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getCorrectAnswersCount(): number {
    return this.questionReviews.filter(q => q.correct).length;
  }

  getWrongAnswersCount(): number {
    return this.questionReviews.filter(q => !q.correct).length;
  }

  isOptionSelected(option: string, selectedAnswer: string | string[]): boolean {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(option);
    }
    return selectedAnswer === option;
  }

  isCorrectAnswer(option: string, correctAnswer: string | string[]): boolean {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(option);
    }
    return correctAnswer === option;
  }

  getAnswerText(answer: string | string[]): string {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer || 'No answer provided';
  }

  // Get options as an array from option1, option2, option3, option4
  getReviewOptions(review: QuestionReview): string[] {
    const options: string[] = [];
    if (review.option1) options.push(review.option1);
    if (review.option2) options.push(review.option2);
    if (review.option3) options.push(review.option3);
    if (review.option4) options.push(review.option4);
    return options;
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  viewAttempts(): void {
    this.router.navigate(['/student/attempts']);
  }
}
