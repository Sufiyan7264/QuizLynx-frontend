import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Common } from '../../core/common/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user';
import { DatePipe } from '@angular/common';

interface CustomQuizConfig {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
}

interface MistakeReviewItem {
  quizId: any;
  quizTitle: string;
  topic: string;
  score: string;
  totalMarks: string;
  incorrectCount: number;
  submittedAt: string;
}

@Component({
  selector: 'app-user-practice',
  standalone: true,
  imports: [FormsModule, ButtonModule, Select, DatePipe],
  templateUrl: './user-practice.html',
  styleUrl: './user-practice.scss',
})
export class UserPractice implements OnInit {
  difficultyOptions = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' },
  ];
  isGenerating = false;
  customQuiz: CustomQuizConfig = {
    topic: '',
    difficulty: 'Medium',
    questions: 10,
  };

  mistakeReviewItems = signal<MistakeReviewItem[]>([]);

  private readonly router = inject(Router);
  private readonly common = inject(Common); // Use your Common service for spinner/toasts if available
  private readonly user = inject(UserService);

  protected aiUsage = signal<number>(0);
  ngOnInit(): void {
    this.getMistakeQuiz();
    this.checkAiUsage();
  }
  checkAiUsage() {
    this.user.checkAiUsage().subscribe({
      next: (res) => {
        if (!res) {
          this.common.showMessage('warn', 'Limit Reached', 'You have reached your daily AI generation limit.');
          this.router.navigate(['/pricing']);
          return;
        }
        this.aiUsage.set(res.attemptsLeft);
      },
      error: (err) => {
        this.common.showMessage('error', 'Error', err?.error?.message || 'Could not verify usage limits.');
      }
    });
  }
  getMistakeQuiz() {
    this.user.getMistakeQuiz().subscribe({
      next: (res: any) => {
        this.mistakeReviewItems.set(res.slice(0, 5));
      },
      error: (err: any) => {
        this.common.showMessage('error', 'Error', err?.error?.message || 'Failed to generate quiz. Please try again.');
      }
    })
  }
  startCustomQuiz(): void {
    if (!this.customQuiz.topic.trim()) {
      this.common.showMessage('error', 'Error', 'Please enter a topic for the quiz.');
      return;
    }
    const payload = {
      topic: this.customQuiz.topic,
      difficulty: this.customQuiz.difficulty,
      questions: this.customQuiz.questions
    };
    this.isGenerating = true;
    console.log('Generating quiz...', payload);
    this.user.createAiTopics(payload)
      .subscribe({
        next: (res: any) => {
          console.log('Quiz Created!', res.quizId);
          this.checkAiUsage();
          this.isGenerating = false;
          this.router.navigate(['/quiz/attempt', res.quizId]);
        },
        error: (err: any) => {
          this.isGenerating = false;
          console.error('Generation failed', err);
          this.common.showMessage('error', 'Error', err?.error?.message || 'Failed to generate quiz. Please try again.');
        }
      });
  }

  retakeMistakes(item: MistakeReviewItem): void {
    console.log('Retake only mistakes for quiz', item);
    this.router.navigate(["quiz/attempt", item.quizId])
  }
}


