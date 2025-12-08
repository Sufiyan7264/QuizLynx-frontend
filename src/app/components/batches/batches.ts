import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BatchService } from '../../core/service/batch';
import { Batch, CreateBatchRequest } from '../../core/interface/interfaces';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-batches',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Dialog,
    Button,
    InputText,
    DatePicker,
    Toast
  ],
  templateUrl: './batches.html',
  styleUrl: './batches.scss',
  providers: [MessageService]
})
export class Batches implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly spinner = inject(NgxSpinnerService);

  batches: Batch[] = [];
  showCreateDialog = false;
  isEditMode = false;
  selectedBatch: Batch | null = null;

  batchForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    startDate: [null],
    endDate: [null]
  });

  get minEndDate(): Date | null {
    const startDate = this.batchForm.get('startDate')?.value;
    return startDate ? new Date(startDate) : null;
  }

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.spinner.show();
    this.batchService.getBatches().subscribe({
      next: (batches) => {
        this.batches = batches;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error loading batches:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load batches'
        });
        this.spinner.hide();
      }
    });
  }

  openCreateDialog(): void {
    this.isEditMode = false;
    this.selectedBatch = null;
    this.batchForm.reset();
    this.showCreateDialog = true;
  }

  openEditDialog(batch: Batch): void {
    this.isEditMode = true;
    this.selectedBatch = batch;
    this.batchForm.patchValue({
      name: batch.name,
      description: batch.description || '',
      startDate: batch.startDate ? new Date(batch.startDate) : null,
      endDate: batch.endDate ? new Date(batch.endDate) : null
    });
    this.showCreateDialog = true;
  }

  closeDialog(): void {
    this.showCreateDialog = false;
    this.isEditMode = false;
    this.selectedBatch = null;
    this.batchForm.reset();
  }

  onSubmit(): void {
    if (this.batchForm.invalid) {
      this.batchForm.markAllAsTouched();
      return;
    }

    const formValue = this.batchForm.value;
    const batchData: CreateBatchRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      startDate: formValue.startDate ? this.formatDateForAPI(formValue.startDate) : undefined,
      endDate: formValue.endDate ? this.formatDateForAPI(formValue.endDate) : undefined
    };

    this.spinner.show();

    if (this.isEditMode && this.selectedBatch?.id) {
      this.batchService.updateBatch(this.selectedBatch.id, batchData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch updated successfully'
          });
          this.loadBatches();
          this.closeDialog();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to update batch'
          });
          this.spinner.hide();
        }
      });
    } else {
      this.batchService.createBatch(batchData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch created successfully'
          });
          this.loadBatches();
          this.closeDialog();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to create batch'
          });
          this.spinner.hide();
        }
      });
    }
  }

  deleteBatch(batch: Batch): void {
    if (!batch.id) return;
    
    if (confirm(`Are you sure you want to delete "${batch.name}"?`)) {
      this.spinner.show();
      this.batchService.deleteBatch(batch.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch deleted successfully'
          });
          this.loadBatches();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to delete batch'
          });
          this.spinner.hide();
        }
      });
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
}

