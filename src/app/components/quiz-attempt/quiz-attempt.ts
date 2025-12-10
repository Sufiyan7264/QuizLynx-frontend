import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizAttemptService } from '../../core/service/quiz-attempt';
import { QuizService } from '../../core/service/quiz';
import { Quiz, QuestionWrapper, QuizResponse, SubmitQuizRequest } from '../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';

type ViewState = 'start' | 'exam' | 'submitting';

@Component({
  selector: 'app-quiz-attempt',
  imports: [
    CommonModule,
    Button,
    InputText,
    Toast
  ],
  templateUrl: './quiz-attempt.html',
  styleUrl: './quiz-attempt.scss',
  providers: [MessageService]
})
export class QuizAttempt implements OnInit, OnDestroy {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly quizService = inject(QuizService);
  private readonly messageService = inject(MessageService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  quizId?: string;
  quiz?: Quiz;
  questions: QuestionWrapper[] = [];
  currentQuestionIndex = 0;
  responses: Map<string, string | string[]> = new Map();
  viewState: ViewState = 'start';
  attemptId?: string;
  startedAt?: Date;
  
  // Timer
  timeRemaining: number = 0; // in seconds
  timerInterval?: any;
  isTimeUp = false;

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params['id'];
    if (this.quizId) {
      this.loadQuiz();
    } else {
      this.router.navigate(['/student-dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadQuiz(): void {
    if (!this.quizId) return;
    this.spinner.show();
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load quiz'
        });
        this.spinner.hide();
        this.router.navigate(['/student-dashboard']);
      }
    });
  }

  startQuiz(): void {
    if (!this.quizId) return;
    
    this.spinner.show();
    this.quizAttemptService.startQuizAttempt(this.quizId).subscribe({
      next: (attempt) => {
        this.attemptId = attempt.id;
        this.startedAt = attempt.startedAt ? new Date(attempt.startedAt) : new Date();
        
        // Load questions (without correct answers)
        this.quizAttemptService.getQuizQuestions(this.quizId!).subscribe({
          next: (questions) => {
            this.questions = questions.sort((a, b) => (a.order || 0) - (b.order || 0));
            this.viewState = 'exam';
            this.startTimer();
            this.spinner.hide();
          },
          error: (error) => {
            console.error('Error loading questions:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || 'Failed to load questions'
            });
            this.spinner.hide();
          }
        });
      },
      error: (error) => {
        console.error('Error starting quiz:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to start quiz'
        });
        this.spinner.hide();
      }
    });
  }

  startTimer(): void {
    if (!this.quiz?.duration) return;
    
    this.timeRemaining = this.quiz.duration * 60; // Convert minutes to seconds
    
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        this.isTimeUp = true;
        this.clearTimer();
        this.autoSubmit();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  get currentQuestion(): QuestionWrapper | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get answeredCount(): number {
    return this.responses.size;
  }

  selectAnswer(answer: string): void {
    if (!this.currentQuestion) return;
    this.responses.set(this.currentQuestion.id, answer);
  }

  getSelectedAnswer(): string | string[] | undefined {
    if (!this.currentQuestion) return undefined;
    return this.responses.get(this.currentQuestion.id);
  }

  isAnswerSelected(answer: string): boolean {
    const selected = this.getSelectedAnswer();
    if (Array.isArray(selected)) {
      return selected.includes(answer);
    }
    return selected === answer;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  isQuestionAnswered(index: number): boolean {
    const question = this.questions[index];
    return question ? this.responses.has(question.id) : false;
  }

  canSubmit(): boolean {
    return this.answeredCount > 0 && !this.isTimeUp;
  }

  submitQuiz(): void {
    if (!this.quizId || !this.canSubmit()) return;

    if (confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
      this.viewState = 'submitting';
      this.clearTimer();
      this.performSubmission();
    }
  }

  autoSubmit(): void {
    if (!this.quizId) return;
    this.viewState = 'submitting';
    this.performSubmission();
  }

  private performSubmission(): void {
    if (!this.quizId) return;

    const responses: QuizResponse[] = [];
    this.responses.forEach((answer, questionId) => {
      responses.push({ questionId, selectedAnswer: answer });
    });

    const request: SubmitQuizRequest = {
      quizId: this.quizId,
      responses
    };

    this.spinner.show();
    this.quizAttemptService.submitQuizAttempt(request).subscribe({
      next: (result) => {
        this.spinner.hide();
        // Navigate to result page
        this.router.navigate(['/quiz/result', result.id || this.quizId]);
      },
      error: (error) => {
        console.error('Error submitting quiz:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to submit quiz'
        });
        this.viewState = 'exam';
        this.spinner.hide();
      }
    });
  }
}

