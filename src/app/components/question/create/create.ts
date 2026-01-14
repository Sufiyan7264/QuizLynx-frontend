import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { QuestionService } from '../../../core/service/question';
import { QuizService } from '../../../core/service/quiz';
import { Question, CreateQuestionRequest, Quiz } from '../../../core/interface/interfaces';
// import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
// import { Select } from 'primeng/select';
// import { Toast } from 'primeng/toast';
import { Common } from '../../../core/common/common';

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    InputText,
    InputNumber,
    // Toast
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss',  
})
export class Create implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly quizService = inject(QuizService);
  private readonly fb = inject(FormBuilder);
  // private readonly messageService = inject(MessageService);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly common = inject(Common);
  quizId?: string;
  questionId?: string;
  quiz?: Quiz;
  isEditMode = false;
  // Hardcoded to MULTIPLE_CHOICE for now - only supporting 4 option multiple choice questions
  // questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' = 'MULTIPLE_CHOICE';

  questionForm: FormGroup = this.fb.group({
    questionTitle: ['', [Validators.required, Validators.minLength(5)]],
    // questionType: ['MULTIPLE_CHOICE', Validators.required], // Hardcoded to MULTIPLE_CHOICE
    marks: [1, [Validators.required, Validators.min(1)]],
    correctAnswer: ['', [Validators.required, this.validateAnswerMatchesOption.bind(this)]],
    option1: ['', Validators.required],
    option2: ['', Validators.required],
    option3: ['', Validators.required],
    option4: ['', Validators.required]
  });

  // Commented out - question type selector removed, only supporting MULTIPLE_CHOICE
  // questionTypeOptions = [
  //   { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
  //   { label: 'True/False', value: 'TRUE_FALSE' },
  //   { label: 'Short Answer', value: 'SHORT_ANSWER' },
  //   { label: 'Essay', value: 'ESSAY' }
  // ];

  // trueFalseOptions = ['True', 'False'];

  ngOnInit(): void {
    this.questionId = this.route.snapshot.params['id'];
    this.quizId = this.route.snapshot.queryParams['quizId'];
    console.log(this.quizId);
    
    if (this.questionId) {
      this.isEditMode = true;
      this.loadQuestion();
    } else if (this.quizId) {
      this.loadQuiz();
      // this.initializeOptions();
    } else {
      this.common.showMessage('error', 'Error', 'Quiz ID is required');
      this.router.navigate(['/instructor/quizzes']);
    }

    // Commented out - question type is hardcoded to MULTIPLE_CHOICE
    // Watch for question type changes
    // this.questionForm.get('questionType')?.valueChanges.subscribe(type => {
    //   this.onQuestionTypeChange(type);
    // });
    
    // Initialize for MULTIPLE_CHOICE (4 options)
    // this.initializeMultipleChoice();

    // Watch for option changes to re-validate correct answer
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

  // Custom validator to ensure correct answer matches one of the options
  validateAnswerMatchesOption(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const correctAnswer = control.value.trim();
    const option1 = this.questionForm?.get('option1')?.value?.trim() || '';
    const option2 = this.questionForm?.get('option2')?.value?.trim() || '';
    const option3 = this.questionForm?.get('option3')?.value?.trim() || '';
    const option4 = this.questionForm?.get('option4')?.value?.trim() || '';

    // Check if correct answer matches any of the options (case-insensitive)
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
        // this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load quiz');
        this.common.hideSpinner();
      }
    });
  }

  loadQuestion(): void {
    if (!this.questionId) return;
    this.common.showSpinner();
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question:Question) => {
        // this.quizId = question.quizId;
        if (this.quizId) {
          this.loadQuiz();
        }
        this.questionForm.patchValue({
          questionTitle: question.questionTitle,
          // questionType: question.questionType,
          marks: question.marks,
          correctAnswer: Array.isArray(question.rightAnswer) 
            ? question.rightAnswer.join(', ') 
            : question.rightAnswer,
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4
        });
        
        // Validate correct answer after loading question data
        this.questionForm.get('correctAnswer')?.updateValueAndValidity();
        
        // if (question.options && question.options.length > 0) {
        //   this.options.clear();
        //   question.options.forEach(option => {
        //     this.addOption(option);
        //   });
        // } else {
        //   this.initializeOptions();
        // }
        
        // Ensure we have exactly 4 options for multiple choice
        // this.onQuestionTypeChange(question.questionType);
        // this.initializeMultipleChoice();
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

  // initializeOptions(): void {
  //   // Always initialize with 4 options for multiple choice questions
  //   if (this.options.length === 0) {
  //     this.addOption();
  //     this.addOption();
  //     this.addOption();
  //     this.addOption();
  //   }
  // }

  // addOption(value: string = ''): void {
  //   const optionControl = this.fb.control(value, Validators.required);
  //   this.options.push(optionControl);
  // }

  // removeOption(index: number): void {
    // Commented out - keeping exactly 4 options for multiple choice
    // if (this.options.length > 2) {
    //   this.options.removeAt(index);
    // }
  // }

  // Commented out - question type is hardcoded to MULTIPLE_CHOICE with 4 options
  // onQuestionTypeChange(type: string): void {
  //   this.questionType = type as any;
  //   const correctAnswerControl = this.questionForm.get('correctAnswer');
  //   
  //   if (type === 'MULTIPLE_CHOICE') {
  //     if (this.options.length < 2) {
  //       this.initializeOptions();
  //     }
  //     correctAnswerControl?.setValidators([Validators.required]);
  //   } else if (type === 'TRUE_FALSE') {
  //     this.options.clear();
  //     this.addOption('True');
  //     this.addOption('False');
  //     correctAnswerControl?.setValue('');
  //     correctAnswerControl?.setValidators([Validators.required]);
  //   } else {
  //     this.options.clear();
  //     correctAnswerControl?.setValidators([Validators.required]);
  //   }
  //   correctAnswerControl?.updateValueAndValidity();
  // }

  // Initialize for MULTIPLE_CHOICE with 4 options
  // initializeMultipleChoice(): void {
  //   const correctAnswerControl = this.questionForm.get('correctAnswer');
  //   if (this.options.length < 4) {
  //     this.initializeOptions();
  //   }
  //   correctAnswerControl?.setValidators([Validators.required]);
  //   correctAnswerControl?.updateValueAndValidity();
  // }

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
    // Always MULTIPLE_CHOICE with 4 options
    const correctAnswer: string = formValue.correctAnswer.trim();
    const option1 = formValue.option1.trim();
    const option2 = formValue.option2.trim();
    const option3 = formValue.option3.trim();
    const option4 = formValue.option4.trim();

    // Final validation: ensure correct answer matches one of the options
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
      // questionType: 'MULTIPLE_CHOICE', // Hardcoded to MULTIPLE_CHOICE
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
        next: (res:any) => {
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
        next: (res:any) => {
          this.common.showMessage('success', 'Success', 'Question created successfully');
          // Reset form for next question
          this.questionForm.reset({
            // questionType: 'MULTIPLE_CHOICE',
            marks: 1
          });
          // this.options.clear();
          // this.initializeOptions();
          // this.initializeMultipleChoice();
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
