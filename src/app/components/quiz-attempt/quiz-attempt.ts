import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizAttemptService } from '../../core/service/quiz-attempt';
import { QuizService } from '../../core/service/quiz';
import { Quiz, QuestionWrapper, QuizResponse, SubmitQuizRequest } from '../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Toast } from 'primeng/toast';
import { Common } from '../../core/common/common';

type ViewState = 'start' | 'exam' | 'submitting';

@Component({
  selector: 'app-quiz-attempt',
  imports: [
    CommonModule,
    Button,
    InputText,ProgressBar
    // Toast
  ],
  templateUrl: './quiz-attempt.html',
  styleUrl: './quiz-attempt.scss',
  // providers: [MessageService]
})
export class QuizAttempt implements OnInit, OnDestroy {
  private readonly quizAttemptService = inject(QuizAttemptService);
  private readonly quizService = inject(QuizService);
  // private readonly messageService = inject(MessageService);
  // private readonly spinner = inject(NgxSpinnerService);
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
  
  // Timer
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
        // this.router.navigate(['/student-dashboard']);
      }
    });
  }
  
  startQuiz() {
    // 1. Check if attempt exists
    this.quizAttemptService.getAttemptStatus(this.quizId || '').subscribe({
      next: (status) => {
         if (status && status.startTime) {
             const start = new Date(status.startTime).getTime();
             const now = new Date().getTime();
             const elapsedSeconds = Math.floor((now - start) / 1000);
             const totalSeconds = this.quiz.timerInMin * 60;
             
             this.timeRemaining = totalSeconds - elapsedSeconds;
             
             if (this.timeRemaining <= 0) {
                 this.autoSubmit(); // Time already expired!
             } else {
                //  this.startTimer(); // Continue from where they left off
                 this.startNewQuiz();
             }
         } else {
             // First time starting
             this.startNewQuiz(); 
         }
      }
    });
  }

  startNewQuiz(): void {
    if (!this.quizId) return;
    
    this.common.showSpinner();

    // FIXED: Directly call getQuizQuestions (Matches GET /api/quiz/{id})
    // We do NOT need startQuizAttempt right now.
    this.quizService.getQuizQuestions(this.quizId).subscribe({
      next: (questions) => {
        this.quizAttemptService.startQuiz(this.quizId || '').subscribe();
        // 1. Assign questions
        // (Optional: Sort them if your backend doesn't send them sorted)
        this.questions = questions; 
        
        // 2. Set Start Time (Client-side for now)
        // this.startedAt = new Date(); 
        
        // 3. Switch View
        this.viewState = 'exam';
        this.startTimer();
        this.common.hideSpinner();
      },
      error: (error:any) => {
        console.error('Error loading questions:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load questions');
        this.common.hideSpinner();
      }
    });
  }

startTimer(): void {
    if (!this.quiz?.timerInMin) return;
    
    // Safety check: If time is 0 (and not calculated yet), default to full time
    if (this.timeRemaining <= 0 && !this.startedAt) { 
        this.timeRemaining = this.quiz.timerInMin * 60;
    }
    
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

  // Get options as an array from option1, option2, option3, option4
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

  submitQuiz(): void {
    if (!this.quizId || !this.canSubmit()) return;

    this.common.confirm('Submit Quiz','Are you sure you want to submit? You cannot change your answers after submission.', 'Yes', 'No', () => {
      this.viewState = 'submitting';
      this.clearTimer();
      this.performSubmission();
    }, () => {
      // Do nothing
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

    // const request: SubmitQuizRequest = {
    //   responses
    // };
    const request = responses;

    this.common.showSpinner();
    this.quizAttemptService.submitQuizAttempt(request,this.quizId).subscribe({
      next: (result) => {
        this.common.hideSpinner();
        // Navigate to result page
        this.router.navigate(['/quiz/result', result.id || this.quizId]);
      },
      error: (error:any) => {
        console.error('Error submitting quiz:', error);
        this.common.showMessage('error','Error',error?.error?.message || 'Failed to submit quiz');
        this.viewState = 'exam';
        this.common.hideSpinner();
      }
    });
  }
}

