import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../core/service/question';
import { QuizService } from '../../../core/service/quiz';
import { Question, Quiz } from '../../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Common } from '../../../core/common/common';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    Button,
    Toast,
    ConfirmDialog
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly quizService = inject(QuizService);
  // private readonly messageService = inject(MessageService);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly common = inject(Common);
  // private readonly confirmationService = inject(ConfirmationService);

  quizId?: string;
  quiz?: Quiz;
  questions: Question[] = [];

  ngOnInit(): void {
    this.quizId = this.route.snapshot.queryParams['quizId'];
    
    if (!this.quizId) {
      this.common.showMessage('error', 'Error', 'Quiz ID is required');
      this.router.navigate(['/instructor/quizzes']);
      return;
    }

    this.loadQuiz();
    this.loadQuestions();
  }

  loadQuiz(): void {
    if (!this.quizId) return;
    this.common.showSpinner();
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load quiz');
        this.common.hideSpinner();
      }
    });
  }

  loadQuestions(): void {
    if (!this.quizId) return;
    this.common.showSpinner();
    this.questionService.getQuestionsByQuiz(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load questions');
        this.common.hideSpinner();
      }
    });
  }

  addQuestion(): void {
    if (this.quizId) {
      this.router.navigate(['/question/create'], { queryParams: { quizId: this.quizId } });
    }
  }

  editQuestion(question: Question): void {
    if (question.id) {
      this.router.navigate(['/question/update', question.id], { queryParams: { quizId: this.quizId } });
    }
  }

  deleteQuestion(question: Question): void {
    if (!question.id) return;

    this.common.confirm('Confirm Deletion', 'Are you sure you want to delete this question?', 'Yes', 'No', () => {
      this.common.showSpinner();
        this.questionService.deleteQuestion(question.id!).subscribe({
          next: () => {
            this.common.showMessage('success', 'Success', 'Question deleted successfully');
            this.loadQuestions();
            this.common.hideSpinner();
          },
          error: (error) => {
              this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to delete question');
              this.common.hideSpinner();
            }
          });
        },
        () => {
          return;
        }
      );
  }

  goBack(): void {
    this.router.navigate(['/instructor/quizzes']);
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'Multiple Choice';
      case 'TRUE_FALSE':
        return 'True/False';
      case 'SHORT_ANSWER':
        return 'Short Answer';
      case 'ESSAY':
        return 'Essay';
      default:
        return type;
    }
  }

  formatCorrectAnswer(answer: string | string[]): string {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer;
  }
}
