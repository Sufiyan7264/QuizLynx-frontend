import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

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
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './user-practice.html',
  styleUrl: './user-practice.scss',
})
export class UserPractice {
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

  startCustomQuiz(): void {
    // Placeholder: integrate with quiz creation / AI generator later
    // For now we just log the selected configuration.
    console.log('Starting custom quiz with config', this.customQuiz);
  }

  retakeMistakes(item: MistakeReviewItem): void {
    // Placeholder: navigate to a "mistakes only" attempt for the quiz
    console.log('Retake only mistakes for quiz', item);
  }
}


