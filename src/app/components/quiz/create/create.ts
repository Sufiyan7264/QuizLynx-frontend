import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizService } from '../../../core/service/quiz';
import { BatchService } from '../../../core/service/batch';
import { Quiz, CreateQuizRequest, Batch } from '../../../core/interface/interfaces';
// import { Dialog } from 'primeng/dialog';
// import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Toast } from 'primeng/toast';
import { Common } from '../../../core/common/common';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Dialog,
    // Button,
    InputText,
    DatePicker,
    InputNumber,
    Select,
    // Toast
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss',
  // providers: [MessageService]
})
export class Create implements OnInit {
  private readonly quizService = inject(QuizService);
  private readonly batchService = inject(BatchService);
  private readonly fb = inject(FormBuilder);
  // private readonly messageService = inject(MessageService);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly common = inject(Common);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  quizId?: string;
  batches: Batch[] = [];
  isEditMode = false;

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
    batchId: [null],
    status: ['DRAFT', Validators.required]
  });

  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Closed', value: 'CLOSED' }
  ];

  get minEndDate(): Date | null {
    const startDate = this.quizForm.get('startDate')?.value;
    return startDate ? new Date(startDate) : null;
  }

  get minDueDate(): Date | null {
    const endDate = this.quizForm.get('endDate')?.value;
    return endDate ? new Date(endDate) : null;
  }

  ngOnInit(): void {
    this.loadBatches();
    this.quizId = this.route.snapshot.params['id'];
    if (this.quizId) {
      this.isEditMode = true;
      this.loadQuiz();
    }
  }

  loadQuiz(): void {
    if (!this.quizId) return;
    this.common.showSpinner();
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
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
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.common.showMessage(
          'error',
          'Error',
          error?.error?.message || 'Failed to load quiz'
        );
        this.common.hideSpinner();
      }
    });
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe({
      next: (batches) => {
        this.batches = batches;
      },
      error: (error) => {
        console.error('Error loading batches:', error);
      }
    });
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
      startDate: formValue.startDate ? this.formatDateForAPI(formValue.startDate) : undefined,
      endDate: formValue.endDate ? this.formatDateForAPI(formValue.endDate) : undefined,
      dueDate: formValue.dueDate ? this.formatDateForAPI(formValue.dueDate) : undefined,
      batchId: formValue.batchId || undefined,
      status: formValue.status
    };

    this.common.showSpinner();

    if (this.isEditMode && this.quizId) {
      this.quizService.updateQuiz(this.quizId, quizData).subscribe({
        next: () => {
          this.common.showMessage(
            'success',
            'Success',
            'Quiz updated successfully'
          );
          this.router.navigate(['/instructor/quizzes']);
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
          if (createdQuiz.id) {
            this.router.navigate(['/question/create'], { queryParams: { quizId: createdQuiz.id } });
          } else {
            this.router.navigate(['/instructor/quizzes']);
          }
          this.common.hideSpinner();
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

  formatDateForAPI(date: Date | string): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
