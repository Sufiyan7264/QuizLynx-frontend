import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { QuestionService } from '../../../core/service/question';
import { QuizService } from '../../../core/service/quiz';
import { Question, CreateQuestionRequest, Quiz } from '../../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Common } from '../../../core/common/common';

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    InputText,
    InputNumber,
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly quizService = inject(QuizService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly common = inject(Common);
  quizId?: string;
  questionId?: string;
  quiz?: Quiz;
  isEditMode = false;

  questionForm: FormGroup = this.fb.group({
    questionTitle: ['', [Validators.required, Validators.minLength(5)]],
    marks: [1, [Validators.required, Validators.min(1)]],
    correctAnswer: ['', [Validators.required, this.validateAnswerMatchesOption.bind(this)]],
    option1: ['', Validators.required],
    option2: ['', Validators.required],
    option3: ['', Validators.required],
    option4: ['', Validators.required]
  });

  ngOnInit(): void {
    this.questionId = this.route.snapshot.params['id'];
    this.quizId = this.route.snapshot.queryParams['quizId'];
    console.log(this.quizId);

    if (this.questionId) {
      this.isEditMode = true;
      this.loadQuestion();
    } else if (this.quizId) {
      this.loadQuiz();
    } else {
      this.common.showMessage('error', 'Error', 'Quiz ID is required');
      this.router.navigate(['/instructor/quizzes']);
    }
    this.questionForm.get('option1')?.valueChanges.subscribe(() => {
      this.questionForm.get('correctAnswer')?.updateValueAndValidity();
    });
    this.questionForm.get('option2')?.valueChanges.subscribe(() => {
      this.questionForm.get('correctAnswer')?.updateValueAndValidity();
    });
    this.questionForm.get('option3')?.valueChanges.subscribe(() => {
      this.questionForm.get('correctAnswer')?.updateValueAndValidity();
    });
    this.questionForm.get('option4')?.valueChanges.subscribe(() => {
      this.questionForm.get('correctAnswer')?.updateValueAndValidity();
    });
  }
  validateAnswerMatchesOption(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const correctAnswer = control.value.trim();
    const option1 = this.questionForm?.get('option1')?.value?.trim() || '';
    const option2 = this.questionForm?.get('option2')?.value?.trim() || '';
    const option3 = this.questionForm?.get('option3')?.value?.trim() || '';
    const option4 = this.questionForm?.get('option4')?.value?.trim() || '';
    const options = [option1, option2, option3, option4];
    const matches = options.some(option =>
      option && option.toLowerCase() === correctAnswer.toLowerCase()
    );

    if (!matches) {
      return { answerNotInOptions: true };
    }

    return null;
  }

  loadQuiz(): void {
    if (!this.quizId) return;
    this.common.showSpinner();
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        console.log(this.quiz);
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.common.hideSpinner();
      }
    });
  }

  loadQuestion(): void {
    if (!this.questionId) return;
    this.common.showSpinner();
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question: Question) => {
        if (this.quizId) {
          this.loadQuiz();
        }
        this.questionForm.patchValue({
          questionTitle: question.questionTitle,
          marks: question.marks,
          correctAnswer: Array.isArray(question.rightAnswer)
            ? question.rightAnswer.join(', ')
            : question.rightAnswer,
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4
        });
        this.questionForm.get('correctAnswer')?.updateValueAndValidity();
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading question:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load question');
        this.common.hideSpinner();
      }
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get optionControls(): FormControl[] {
    return this.options.controls as FormControl[];
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }
    console.log(this.quizId);
    if (!this.quizId) {
      this.common.showMessage('error', 'Error', 'Quiz ID is required');
      return;
    }

    const formValue = this.questionForm.value;
    const correctAnswer: string = formValue.correctAnswer.trim();
    const option1 = formValue.option1.trim();
    const option2 = formValue.option2.trim();
    const option3 = formValue.option3.trim();
    const option4 = formValue.option4.trim();
    const options = [option1, option2, option3, option4];
    const answerMatches = options.some(option =>
      option && option.toLowerCase() === correctAnswer.toLowerCase()
    );

    if (!answerMatches) {
      this.common.showMessage('error', 'Validation Error', 'Correct answer must match one of the options');
      this.questionForm.get('correctAnswer')?.setErrors({ answerNotInOptions: true });
      this.questionForm.get('correctAnswer')?.markAsTouched();
      return;
    }

    const questionData: CreateQuestionRequest = {
      quizId: Number(this.quizId),
      questionTitle: formValue.questionTitle,
      option1: formValue.option1,
      option2: formValue.option2,
      option3: formValue.option3,
      option4: formValue.option4,
      rightAnswer: correctAnswer,
      marks: formValue.marks,
    };

    this.common.showSpinner();

    if (this.isEditMode && this.questionId) {
      this.questionService.updateQuestion(this.questionId, questionData).subscribe({
        next: (res: any) => {
          this.common.showMessage('success', 'Success', 'Question updated successfully');
          this.navigateBack();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to update question');
          this.common.hideSpinner();
        }
      });
    } else {
      this.questionService.createQuestion(questionData).subscribe({
        next: (res: any) => {
          this.common.showMessage('success', 'Success', 'Question created successfully');
          this.questionForm.reset({
            marks: 1
          });
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to create question');
          this.common.hideSpinner();
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
