import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Common } from '../../core/common/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user';

interface CustomQuizConfig {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
}

interface MistakeReviewItem {
  quizTitle: string;
  topic: string;
  lastScore: string;
  incorrectCount: number;
  lastAttemptAgo: string;
}

@Component({
  selector: 'app-user-practice',
  standalone: true,
  imports: [FormsModule, ButtonModule,Select],
  templateUrl: './user-practice.html',
  styleUrl: './user-practice.scss',
})
export class UserPractice {
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

  mistakeReviewItems: MistakeReviewItem[] = [
    {
      quizTitle: 'Python: Functions & Loops',
      topic: 'Python',
      lastScore: '6 / 15',
      incorrectCount: 9,
      lastAttemptAgo: '2 days ago',
    },
    {
      quizTitle: 'Modern World History',
      topic: 'History',
      lastScore: '8 / 20',
      incorrectCount: 12,
      lastAttemptAgo: '5 days ago',
    },
    {
      quizTitle: 'Algebra & Linear Equations',
      topic: 'Math',
      lastScore: '5 / 10',
      incorrectCount: 5,
      lastAttemptAgo: '1 week ago',
    },
  ];

  private router = inject(Router);
  private common = inject(Common); // Use your Common service for spinner/toasts if available
  private user = inject(UserService);

  // ... options and arrays remain the same ...



  // Updated Function
  startCustomQuiz(): void {
    if (!this.customQuiz.topic.trim()) {
      this.common.showMessage('error','Error', 'Please enter a topic for the quiz.');
      return;
    }

    // 1. Prepare Payload
    const payload = {
      topic: this.customQuiz.topic,
      difficulty: this.customQuiz.difficulty,
      questions: this.customQuiz.questions
    };
this.isGenerating = true;
    console.log('Generating quiz...', payload);
    // this.common.showSpinner(); 

    // 2. Call Backend
    this.user.createAiTopics(payload)
      .subscribe({
        next: (res:any) => {
          // this.common.hideSpinner();
          console.log('Quiz Created!', res.quizId);
          this.isGenerating = false;
          // 3. Navigate to Attempt Page
          this.router.navigate(['/quiz/attempt', res.quizId]);
        },
        error: (err:any) => {
          // this.common.hideSpinner();
          this.isGenerating = false;
          console.error('Generation failed', err);
          this.common.showMessage('error','Error', err?.error?.message || 'Failed to generate quiz. Please try again.');
        }
      });
  }

  retakeMistakes(item: MistakeReviewItem): void {
    // Placeholder: navigate to a "mistakes only" attempt for the quiz
    console.log('Retake only mistakes for quiz', item);
  }
}


