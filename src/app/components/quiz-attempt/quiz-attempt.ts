import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizAttemptService } from '../../core/service/quiz-attempt';
import { QuizService } from '../../core/service/quiz';
import { QuestionWrapper, QuizResponse } from '../../core/interface/interfaces';
import { Common } from '../../core/common/common';

type ViewState = 'start' | 'exam' | 'submitting';

@Component({
  selector: 'app-quiz-attempt',
  imports: [
  ],
  templateUrl: './quiz-attempt.html',
  styleUrl: './quiz-attempt.scss'
})
export class QuizAttempt implements OnInit, OnDestroy {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly common = inject(Common);
  quizId?: string;
  quiz?: any;
  questions: QuestionWrapper[] = [];
  currentQuestionIndex = 0;
  responses: Map<string, string | string[]> = new Map();
  viewState: ViewState = 'start';
  attemptId?: string;
  startedAt?: Date;
  timeRemaining: number = 0; // in seconds
  timerInterval?: any;
  isTimeUp = false;

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params['id'];
    console.log(this.quizId);
    if (this.quizId) {
      this.loadQuiz();
    } else {
      this.router.navigate(['/student-dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.saveProgress();
    this.clearTimer();
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
        this.common.hideSpinner();
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load quiz');
      }
    });
  }
  startQuiz() {
    if (!this.quizId) return;
    this.quizAttemptService.getAttemptStatus(this.quizId).subscribe({
      next: (status: any) => {
        if (status && status.remainingSeconds !== undefined && status.remainingSeconds !== null) {
          console.log('Resuming quiz with seconds remaining:', status.remainingSeconds);
          this.timeRemaining = status.remainingSeconds;
          console.log('Time remaining set to:', this.timeRemaining);
          if (this.timeRemaining <= 0) {
            this.autoSubmit(); // Time expired while paused
          } else {
            this.loadQuestionsAndStart();
          }
        } else {
          console.log('Starting fresh quiz');
          this.startNewQuiz();
        }
      },
      error: (err) => {
        console.error('Error checking status', err);
        this.startNewQuiz();
      }
    });
  }
  startNewQuiz(): void {
    if (!this.quizId || !this.quiz) return;
    this.timeRemaining = this.quiz.timerInMin * 60;

    this.common.showSpinner();
    this.quizAttemptService.startQuiz(this.quizId).subscribe({
      next: () => {
        this.loadQuestionsAndStart();
      },
      error: (err) => {
        this.common.hideSpinner();
        this.common.showMessage('error', 'Error', 'Failed to start quiz session');
      }
    });
  }
  loadQuestionsAndStart(): void {
    if (!this.quizId) return;

    this.common.showSpinner();

    this.quizService.getQuizQuestions(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.viewState = 'exam';
        this.startTimer();

        this.common.hideSpinner();
      },
      error: (error: any) => {
        console.error('Error loading questions:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load questions');
        this.common.hideSpinner();
      }
    });
  }
  startTimer(): void {
    if (this.timeRemaining <= 0 && this.quiz?.timerInMin) {
      this.timeRemaining = this.quiz.timerInMin * 60;
    }
    this.clearTimer();

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
  getQuestionOptions(question: QuestionWrapper | undefined): string[] {
    if (!question) return [];
    const options: string[] = [];
    if (question.option1) options.push(question.option1);
    if (question.option2) options.push(question.option2);
    if (question.option3) options.push(question.option3);
    if (question.option4) options.push(question.option4);
    return options;
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

  getTimerClass(): string {
    if (this.timeRemaining < 60) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    } else if (this.timeRemaining < 300) {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  }

  getQuestionNavButtonClass(index: number): string {
    const isActive = index === this.currentQuestionIndex;
    const isAnswered = this.isQuestionAnswered(index);

    if (isActive) {
      return 'bg-indigo-600 text-white';
    } else if (isAnswered) {
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600';
  }

  getPrevButtonClass(): string {
    if (this.currentQuestionIndex === 0) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors';
  }

  getNextButtonClass(): string {
    if (this.currentQuestionIndex === this.totalQuestions - 1) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors';
  }

  getSubmitButtonClass(): string {
    if (!this.canSubmit()) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
    }
    return 'bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg';
  }

  submitQuiz(): void {
    if (!this.quizId || !this.canSubmit()) return;

    this.common.confirm('Submit Quiz', 'Are you sure you want to submit? You cannot change your answers after submission.', 'Yes', 'No', () => {
      this.viewState = 'submitting';
      this.clearTimer();
      this.performSubmission();
    }, () => {
    });
  }

  autoSubmit(): void {
    if (!this.quizId) return;
    this.viewState = 'submitting';
    this.performSubmission();
  }

  private performSubmission(): void {
    if (!this.quizId) return;

    const responses: QuizResponse[] = [];
    this.responses.forEach((answer, id) => {
      responses.push({ id, response: answer });
    });

    const request = responses;

    this.common.showSpinner();
    this.quizAttemptService.submitQuizAttempt(request, this.quizId).subscribe({
      next: (result) => {
        this.common.hideSpinner();
        this.router.navigate(['/quiz/result', result.id || this.quizId]);
      },
      error: (error: any) => {
        console.error('Error submitting quiz:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to submit quiz');
        this.viewState = 'exam';
        this.common.hideSpinner();
      }
    });
  }
  saveProgress() {
    if (!this.quizId || this.isTimeUp || this.viewState === 'submitting') return;
    this.quizAttemptService.pauseQuiz(this.quizId, this.timeRemaining).subscribe();
  }
  @HostListener('window:beforeunload', ['$event'])
  handleClose(event: any) {
    this.saveProgress();
  }
}

