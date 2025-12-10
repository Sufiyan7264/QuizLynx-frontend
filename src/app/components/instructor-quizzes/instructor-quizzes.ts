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
  private readonly messageService = inject(MessageService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);

  quizzes: Quiz[] = [];
  batches: Batch[] = [];
  showCreateDialog = false;
  isEditMode = false;
  selectedQuiz: Quiz | null = null;

  quizForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    subject: [''],
    duration: [60, [Validators.required, Validators.min(1)]],
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
    this.loadQuizzes();
    this.loadBatches();
  }

  loadQuizzes(): void {
    this.spinner.show();
    this.quizService.getQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load quizzes'
        });
        this.spinner.hide();
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

  openCreateDialog(): void {
    this.isEditMode = false;
    this.selectedQuiz = null;
    this.quizForm.reset({
      duration: 60,
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
      duration: quiz.duration || 60,
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
      duration: formValue.duration,
      totalMarks: formValue.totalMarks,
      passingMarks: formValue.passingMarks,
      startDate: formValue.startDate ? this.formatDateForAPI(formValue.startDate) : undefined,
      endDate: formValue.endDate ? this.formatDateForAPI(formValue.endDate) : undefined,
      dueDate: formValue.dueDate ? this.formatDateForAPI(formValue.dueDate) : undefined,
      batchId: formValue.batchId || undefined,
      status: formValue.status
    };

    this.spinner.show();

    if (this.isEditMode && this.selectedQuiz?.id) {
      this.quizService.updateQuiz(this.selectedQuiz.id, quizData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quiz updated successfully'
          });
          this.loadQuizzes();
          this.closeDialog();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to update quiz'
          });
          this.spinner.hide();
        }
      });
    } else {
      this.quizService.createQuiz(quizData).subscribe({
        next: (createdQuiz) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quiz created successfully'
          });
          this.loadQuizzes();
          this.closeDialog();
          this.spinner.hide();
          // Navigate to add questions
          if (createdQuiz.id) {
            this.router.navigate(['/question/create'], { queryParams: { quizId: createdQuiz.id } });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to create quiz'
          });
          this.spinner.hide();
        }
      });
    }
  }

  deleteQuiz(quiz: Quiz): void {
    if (!quiz.id) return;
    
    if (confirm(`Are you sure you want to delete "${quiz.title}"? This will also delete all associated questions.`)) {
      this.spinner.show();
      this.quizService.deleteQuiz(quiz.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quiz deleted successfully'
          });
          this.loadQuizzes();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to delete quiz'
          });
          this.spinner.hide();
        }
      });
    }
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

  formatDateForAPI(date: Date | string): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

