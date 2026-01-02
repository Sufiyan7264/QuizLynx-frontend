import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../core/service/quiz';
import { BatchService } from '../../core/service/batch';
import { Quiz, CreateQuizRequest, Batch } from '../../core/interface/interfaces';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-instructor-quizzes',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Dialog,
    Button,
    InputText,
    DatePicker,
    InputNumber,
    Select,
    Toast
  ],
  templateUrl: './instructor-quizzes.html',
  styleUrl: './instructor-quizzes.scss',
  providers: [MessageService]
})
export class InstructorQuizzes implements OnInit {
  private readonly quizService = inject(QuizService);
  private readonly batchService = inject(BatchService);
  private readonly fb = inject(FormBuilder);
  // private readonly messageService = inject(MessageService);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly common = inject(Common);
  private readonly router = inject(Router);

  quizzes: Quiz[] = [];
  batches: Batch[] = [];
  showCreateDialog = false;
  isEditMode = false;
  selectedQuiz: Quiz | null = null;
  minEndDate: Date | null = null;
  minDueDate: Date | null = null;

  quizForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    subject: [''],
    timerInMin: [60, [Validators.required, Validators.min(1)]],
    totalMarks: [100, [Validators.required, Validators.min(1)]],
    passingMarks: [50, [Validators.required, Validators.min(0)]],
    startDate: [null],
    endDate: [null],
    dueDate: [null],
    batchId: ['',[ Validators.required]],
    status: ['DRAFT', Validators.required]
  });

  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Closed', value: 'CLOSED' }
  ];

  // get minEndDate(): Date | null {
  //   console.log(this.quizForm.get('startDate')?.value);
  //   const startDate = this.quizForm.get('startDate')?.value;
  //   return startDate ? new Date(startDate) : null;
  // }

  // get minDueDate(): Date | null {
  //   const endDate = this.quizForm.get('endDate')?.value;
  //   return endDate ? new Date(endDate) : null;
  // }

  ngOnInit(): void {
    this.loadQuizzes();
    this.loadBatches();
    this.setupDateValidators();
  }

  loadQuizzes(): void {
    this.common.showSpinner();
    this.quizService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        this.common.showMessage(
          'error',
          'Error',
          error?.error?.message || 'Failed to load quizzes'
        );
        this.common.hideSpinner();
      }
    });
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe({
      next: (batches) => {
        console.log(batches);
        this.batches = batches;
        // batches.forEach(batch => {
        //   this.batches.push({
        //     label: batch.batchName,
        //     value: batch.id || ''
        //   })
        // });
        // console.log(this.batches)
      },
      error: (error) => {
        console.error('Error loading batches:', error);
      }
    });
  }

  openCreateDialog(): void {
    this.isEditMode = false;
    this.selectedQuiz = null;
    this.quizForm.reset({
      timerInMin: 60,
      totalMarks: 100,
      passingMarks: 50,
      status: 'DRAFT'
    });
    this.showCreateDialog = true;
  }

  openEditDialog(quiz: Quiz): void {
    this.isEditMode = true;
    this.selectedQuiz = quiz;
    this.quizForm.patchValue({
      title: quiz.title,
      description: quiz.description || '',
      subject: quiz.subject || '',
      timerInMin: quiz.timerInMin || 60,
      totalMarks: quiz.totalMarks || 100,
      passingMarks: quiz.passingMarks || 50,
      startDate: quiz.startDate ? new Date(quiz.startDate) : null,
      endDate: quiz.endDate ? new Date(quiz.endDate) : null,
      dueDate: quiz.dueDate ? new Date(quiz.dueDate) : null,
      batchId: quiz.batchId || null,
      status: quiz.status || 'DRAFT'
    });
    this.showCreateDialog = true;
  }

  closeDialog(): void {
    this.showCreateDialog = false;
    this.isEditMode = false;
    this.selectedQuiz = null;
    this.quizForm.reset();
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const formValue = this.quizForm.value;
    const quizData: CreateQuizRequest = {
      title: formValue.title,
      description: formValue.description || undefined,
      subject: formValue.subject || undefined,
      timerInMin: formValue.timerInMin,
      totalMarks: formValue.totalMarks,
      passingMarks: formValue.passingMarks,
      startDate: formValue.startDate ? formValue.startDate : undefined,
      endDate: formValue.endDate ? formValue.endDate : undefined,
      dueDate: formValue.dueDate ? formValue.dueDate : undefined,
      batchId: formValue.batchId || undefined,
      status: formValue.status
    };

    this.common.showSpinner();

    if (this.isEditMode && this.selectedQuiz?.id) {
      this.quizService.updateQuiz(this.selectedQuiz.id, quizData).subscribe({
        next: () => {
          this.common.showMessage(
            'success',
            'Success',
            'Quiz updated successfully'
          );
          this.loadQuizzes();
          this.closeDialog();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage(
            'error',
            'Error',
            error?.error?.message || 'Failed to update quiz'
          );
          this.common.hideSpinner();
        }
      });
    } else {
      this.quizService.createQuiz(quizData).subscribe({
        next: (createdQuiz) => {
          this.common.showMessage(
          'success',
          'Success',
          'Quiz created successfully'
          );
          this.loadQuizzes();
          this.closeDialog();
          this.common.hideSpinner();
          // Navigate to add questions
          if (createdQuiz.id) {
            this.router.navigate(['/question/create'], { queryParams: { quizId: createdQuiz.id } });
          }
        },
        error: (error) => {
          this.common.showMessage(
            'error',
            'Error',
            error?.error?.message || 'Failed to create quiz'
          );
          this.common.hideSpinner();
        }
      });
    }
  }

  deleteQuiz(quiz: Quiz): void {
    if (!quiz.id) return;
    this.common.confirm('Confirm Deletion', `Are you sure you want to delete "${quiz.title}"? This will also delete all associated questions.`, 'Yes', 'No', () => {
      this.common.showSpinner();
      this.quizService.deleteQuiz(quiz.id || '').subscribe({
        next: () => {
          this.common.showMessage(
            'success',
                'Success',
            'Quiz deleted successfully'
          );
          this.loadQuizzes();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage(
            'error',
            'Error',
            error?.error?.message || 'Failed to delete quiz'
          );
          this.common.hideSpinner();
        }
      });
    }, () => {
      return;
    });
  }

  addQuestions(quiz: Quiz): void {
    if (quiz.id) {
      this.router.navigate(['/question/create'], { queryParams: { quizId: quiz.id } });
    }
  }

  viewQuestions(quiz: Quiz): void {
    if (quiz.id) {
      this.router.navigate(['/question/all'], { queryParams: { quizId: quiz.id } });
    }
  }

  formatDisplayDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  setupDateValidators(): void {
    // Watch for Start Date changes to update Min End Date
  this.quizForm.get('startDate')?.valueChanges.subscribe((startDate) => {
    console.log('Start Date Changed:', startDate); // This will now only log when you actually pick a date
    this.minEndDate = startDate ? new Date(startDate) : null;
    
    // Optional: If start date is after current end date, clear end date
    const currentEndDate = this.quizForm.get('endDate')?.value;
    if (currentEndDate && this.minEndDate && new Date(currentEndDate) < this.minEndDate) {
      this.quizForm.get('endDate')?.setValue(null);
    }
  });
  this.quizForm.get('endDate')?.valueChanges.subscribe((endDate) => {
    this.minDueDate = endDate ? new Date(endDate) : null;
  });
}

  // formatDateForAPI(date: Date | string): string {
  //   if (!date) return '';
  //   const d = date instanceof Date ? date : new Date(date);
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, '0');
  //   const day = String(d.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'status-published';
      case 'CLOSED':
        return 'status-closed';
      default:
        return 'status-draft';
    }
  }
}

