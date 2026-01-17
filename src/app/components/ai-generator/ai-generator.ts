import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea'; import { HttpClient } from '@angular/common/http';
import { SelectModule } from 'primeng/select'; // For selecting Quiz
import { QuizService } from '../../core/service/quiz';
import { UserService } from '../../core/service/user';
import { Router } from '@angular/router';
import { Common } from '../../core/common/common';
@Component({
  selector: 'app-ai-generator',
  imports: [FormsModule, DialogModule, TextareaModule, SliderModule, ButtonModule, SelectModule], templateUrl: './ai-generator.html',
  styleUrl: './ai-generator.scss'
})
export class AiGenerator implements OnInit {
  @Input() visible: boolean = false;
  @Input() preSelectedQuizId?: string;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<void>();

  private readonly http = inject(HttpClient);
  private readonly quizService = inject(QuizService); // To fetch quiz list
  private readonly common = inject(Common);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly BASE_URL = 'https://localhost:8080/api';
  step: 'input' | 'preview' = 'input';
  isProcessing: boolean = false;
  promptText: string = '';
  questionCount: number = 5;
  generatedQuestions: any[] = [];
  quizzes: any[] = [];
  selectedQuiz: any = null;

  presets = ["class 9th hindi first chapter", "History of Space Travel", "Photosynthesis basics"];
  aiUsage: any;

  ngOnInit() {
    this.loadQuizzes();
    this.checkAiUsage();
  }

  loadQuizzes() {
    this.quizService.getAllQuizzes().subscribe(data => {
      this.quizzes = data;
      console.log(this.quizzes)
      if (this.preSelectedQuizId) {
        this.selectedQuiz = this.quizzes.find(q => q.id === this.preSelectedQuizId);
      }
    });
  }
  checkAiUsage() {
    this.userService.checkAiUsage().subscribe({
      next: (res) => {
        if (!res) {
          this.common.showMessage('warn', 'Limit Reached', 'You have reached your daily AI generation limit.');
          this.router.navigate(['/pricing']);
          return;
        }
        this.aiUsage = res.attemptsLeft;
      },
      error: (err) => {
        this.common.showMessage('error', 'Error', err?.error?.message || 'Could not verify usage limits.');
      }
    });
  }
  generatePreview() {
    if (!this.promptText.trim()) return;
    this.isProcessing = true;
    const payload = { contentText: this.promptText, numberOfQuestions: this.questionCount };
    this.http.post<any[]>(`${this.BASE_URL}/ai/preview`, payload).subscribe({
      next: (data) => {
        this.generatedQuestions = data.map(q => ({
          ...q,
          marks: 0
        }));
        this.checkAiUsage();
        this.step = 'preview'; // Switch to preview mode
        this.isProcessing = false;
      },
      error: (err) => {
        this.common.showMessage('error', 'Error', 'AI Generation failed');
        this.isProcessing = false;
      }
    });
  }
  saveQuestions() {
    if (!this.selectedQuiz) {
      this.common.showMessage('warn', 'Select Quiz', 'Please select a quiz to save these questions.');
      return;
    }

    this.isProcessing = true;
    const payload = {
      quizId: this.selectedQuiz.id,
      questions: this.generatedQuestions
    };

    this.http.post(`${this.BASE_URL}/ai/save-bulk`, payload).subscribe({
      next: () => {
        this.common.showMessage('success', 'Saved', 'Questions added to quiz successfully');
        this.onSaved.emit();
        this.reset();
        this.closeDialog();
      },
      error: (err) => {
        this.isProcessing = false;
        this.common.showMessage('error', 'Error', 'Failed to save questions');
      }
    });
  }

  reset() {
    this.step = 'input';
    this.promptText = '';
    this.generatedQuestions = [];
    this.isProcessing = false;
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    setTimeout(() => this.reset(), 300);
  }

  usePreset(text: string) {
    this.promptText = text;
  }

}
