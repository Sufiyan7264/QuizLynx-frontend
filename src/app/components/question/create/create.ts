import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../../core/service/question';
import { QuizService } from '../../../core/service/quiz';
import { Question, CreateQuestionRequest, Quiz } from '../../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputText,
    InputNumber,
    Select,
    Toast
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss',
  providers: [MessageService]
})
export class Create implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly quizService = inject(QuizService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  quizId?: string;
  questionId?: string;
  quiz?: Quiz;
  isEditMode = false;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' = 'MULTIPLE_CHOICE';

  questionForm: FormGroup = this.fb.group({
    questionText: ['', [Validators.required, Validators.minLength(5)]],
    questionType: ['MULTIPLE_CHOICE', Validators.required],
    marks: [1, [Validators.required, Validators.min(1)]],
    correctAnswer: ['', Validators.required],
    options: this.fb.array([])
  });

  questionTypeOptions = [
    { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
    { label: 'True/False', value: 'TRUE_FALSE' },
    { label: 'Short Answer', value: 'SHORT_ANSWER' },
    { label: 'Essay', value: 'ESSAY' }
  ];

  trueFalseOptions = ['True', 'False'];

  ngOnInit(): void {
    this.questionId = this.route.snapshot.params['id'];
    this.quizId = this.route.snapshot.queryParams['quizId'];
    
    if (this.questionId) {
      this.isEditMode = true;
      this.loadQuestion();
    } else if (this.quizId) {
      this.loadQuiz();
      this.initializeOptions();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Quiz ID is required'
      });
      this.router.navigate(['/instructor/quizzes']);
    }

    // Watch for question type changes
    this.questionForm.get('questionType')?.valueChanges.subscribe(type => {
      this.onQuestionTypeChange(type);
    });
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
      }
    });
  }

  loadQuestion(): void {
    if (!this.questionId) return;
    this.spinner.show();
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question) => {
        this.quizId = question.quizId;
        if (this.quizId) {
          this.loadQuiz();
        }
        this.questionForm.patchValue({
          questionText: question.questionText,
          questionType: question.questionType,
          marks: question.marks,
          correctAnswer: Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.join(', ') 
            : question.correctAnswer
        });
        
        if (question.options && question.options.length > 0) {
          this.options.clear();
          question.options.forEach(option => {
            this.addOption(option);
          });
        } else {
          this.initializeOptions();
        }
        
        this.onQuestionTypeChange(question.questionType);
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error loading question:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load question'
        });
        this.spinner.hide();
      }
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get optionControls(): FormControl[] {
    return this.options.controls as FormControl[];
  }

  initializeOptions(): void {
    if (this.options.length === 0) {
      this.addOption();
      this.addOption();
    }
  }

  addOption(value: string = ''): void {
    const optionControl = this.fb.control(value, Validators.required);
    this.options.push(optionControl);
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  onQuestionTypeChange(type: string): void {
    this.questionType = type as any;
    const correctAnswerControl = this.questionForm.get('correctAnswer');
    
    if (type === 'MULTIPLE_CHOICE') {
      if (this.options.length < 2) {
        this.initializeOptions();
      }
      correctAnswerControl?.setValidators([Validators.required]);
    } else if (type === 'TRUE_FALSE') {
      this.options.clear();
      this.addOption('True');
      this.addOption('False');
      correctAnswerControl?.setValue('');
      correctAnswerControl?.setValidators([Validators.required]);
    } else {
      this.options.clear();
      correctAnswerControl?.setValidators([Validators.required]);
    }
    correctAnswerControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    if (!this.quizId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Quiz ID is required'
      });
      return;
    }

    const formValue = this.questionForm.value;
    let correctAnswer: string | string[];
    
    if (this.questionType === 'MULTIPLE_CHOICE' || this.questionType === 'TRUE_FALSE') {
      // For multiple choice, correctAnswer should be one of the options
      correctAnswer = formValue.correctAnswer;
    } else {
      correctAnswer = formValue.correctAnswer;
    }

    const questionData: CreateQuestionRequest = {
      quizId: this.quizId,
      questionText: formValue.questionText,
      questionType: formValue.questionType,
      marks: formValue.marks,
      correctAnswer: correctAnswer,
      options: this.questionType === 'MULTIPLE_CHOICE' || this.questionType === 'TRUE_FALSE' 
        ? formValue.options.filter((opt: string) => opt && opt.trim() !== '')
        : undefined
    };

    this.spinner.show();

    if (this.isEditMode && this.questionId) {
      this.questionService.updateQuestion(this.questionId, questionData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Question updated successfully'
          });
          this.navigateBack();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to update question'
          });
          this.spinner.hide();
        }
      });
    } else {
      this.questionService.createQuestion(questionData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Question created successfully'
          });
          // Reset form for next question
          this.questionForm.reset({
            questionType: 'MULTIPLE_CHOICE',
            marks: 1
          });
          this.options.clear();
          this.initializeOptions();
          this.onQuestionTypeChange('MULTIPLE_CHOICE');
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to create question'
          });
          this.spinner.hide();
        }
      });
    }
  }

  navigateBack(): void {
    if (this.quizId) {
      this.router.navigate(['/question/all'], { queryParams: { quizId: this.quizId } });
    } else {
      this.router.navigate(['/instructor/quizzes']);
    }
  }

  finishAndGoBack(): void {
    this.navigateBack();
  }
}
