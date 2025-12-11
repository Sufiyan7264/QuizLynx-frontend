import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BatchService } from '../../core/service/batch';
import { Batch } from '../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-student-join',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Toast
  ],
  templateUrl: './student-join.html',
  styleUrl: './student-join.scss',
  providers: [MessageService]
})
export class StudentJoin implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);

  joinForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
  });

  previewBatchs: Batch | null = null;
  showPreview = false;
  isLoadingPreview = false;

  ngOnInit(): void {
    // Auto-focus on code input
  }

  onCodeInput(): void {
    const code = this.joinForm.get('code')?.value?.trim().toUpperCase();
    if (code && code.length >= 4) {
      this.previewBatch(code);
    } else {
      this.previewBatchs = null;
      this.showPreview = false;
    }
  }

  previewBatch(code: string): void {
    this.isLoadingPreview = true;
    this.batchService.getBatchByCode(code).subscribe({
      next: (batch) => {
        this.previewBatchs = batch;
        this.showPreview = true;
        this.isLoadingPreview = false;
      },
      error: (error) => {
        // Batch not found or invalid code - hide preview
        this.previewBatchs = null;
        this.showPreview = false;
        this.isLoadingPreview = false;
      }
    });
  }

  onSubmit(): void {
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    const code = this.joinForm.get('code')?.value?.trim().toUpperCase();
    if (!code) {
      return;
    }

    this.spinner.show();
    this.batchService.joinBatchByCode(code).subscribe({
      next: (batch) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully joined "${batch.batchName}"!`
        });
        this.joinForm.reset();
        this.previewBatchs = null;
        this.showPreview = false;
        this.spinner.hide();
        // Navigate to student batches page after a short delay
        setTimeout(() => {
          this.router.navigate(['/student/batches']);
        }, 1500);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to join class. Please check the code and try again.'
        });
        this.spinner.hide();
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

