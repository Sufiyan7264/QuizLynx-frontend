import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BatchService } from '../../core/service/batch';
import { Batch } from '../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-student-join',
  imports: [
    ReactiveFormsModule,
    InputText,
  ],
  templateUrl: './student-join.html',
  styleUrl: './student-join.scss',
})
export class StudentJoin implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly fb = inject(FormBuilder);
  private readonly common = inject(Common);
  private readonly router = inject(Router);

  joinForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
  });

  previewBatchs: Batch | null = null;
  showPreview = false;
  isLoadingPreview = false;

  ngOnInit(): void {
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

    this.common.showSpinner();
    this.batchService.joinBatchByCode(code).subscribe({
      next: (res: any) => {
        this.common.showMessage('success', 'Success', res?.message);
        this.joinForm.reset();
        this.previewBatchs = null;
        this.showPreview = false;
        this.common.hideSpinner();
        setTimeout(() => {
          this.router.navigate(['/student/batches']);
        }, 1500);
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to join class. Please check the code and try again.');
        this.common.hideSpinner();
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

