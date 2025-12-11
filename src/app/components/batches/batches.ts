import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BatchService } from '../../core/service/batch';
import { Batch, CreateBatchRequest } from '../../core/interface/interfaces';
import { Dialog } from 'primeng/dialog';
// import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
// import { DatePicker } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { Common } from '../../core/common/common';
@Component({
  selector: 'app-batches',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Dialog,
    // Button,
    InputText,
    // DatePicker,
    Toast
  ],
  templateUrl: './batches.html',
  styleUrl: './batches.scss',
  providers: [MessageService]
})
export class Batches implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly common = inject(Common);

  batches: Batch[] = [];
  filteredBatches: Batch[] = [];
  searchTerm: string = '';
  showCreateDialog = false;
  isEditMode = false;
  selectedBatch: Batch | null = null;

  batchForm: FormGroup = this.fb.group({
    batchName: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    // startDate: [null],
    // endDate: [null]
  });

  // get minEndDate(): Date | null {
  //   const startDate = this.batchForm.get('startDate')?.value;
  //   return startDate ? new Date(startDate) : null;
  // }

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.common.showSpinner();
    this.batchService.getBatches().subscribe({
      next: (batches) => {
        this.batches = batches;
        this.applyFilters();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage( 'error', 'Error', error?.error?.message || 'Failed to load batches' );
        this.common.hideSpinner();
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
      batchName: batch.batchName,
      description: batch.description || '',
      // startDate: batch.startDate ? new Date(batch.startDate) : null,
      // endDate: batch.endDate ? new Date(batch.endDate) : null
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
      batchName: formValue.batchName,
      description: formValue.description || undefined,
      // startDate: formValue.startDate ? this.formatDateForAPI(formValue.startDate) : undefined,
      // endDate: formValue.endDate ? this.formatDateForAPI(formValue.endDate) : undefined
    };

    this.common.showSpinner();

    if (this.isEditMode && this.selectedBatch?.id) {
      this.batchService.updateBatch(this.selectedBatch.id, batchData).subscribe({
        next: (response:any) => {
          this.common.showMessage( 'success', 'Success',response.message ?? 'Batch updated successfully' );
          this.loadBatches();
          this.closeDialog();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage( 'error', 'Error',error?.error?.message || 'Failed to update batch' );
          this.common.hideSpinner();
        }
      });
    } else {
      this.batchService.createBatch(batchData).subscribe({
        next: () => {
          this.common.showMessage( 'success', 'Success', 'Batch created successfully' );
          this.loadBatches();
          this.closeDialog();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage( 'error', 'Error',error?.error?.message || 'Failed to create batch' );
          this.common.hideSpinner();
        }
      });
    }
  }

  deleteBatch(batch: Batch): void {
    if (!batch.id) return;
    this.common.confirm( 'Delete Batch', `Are you sure you want to delete "${batch.batchName}"?`, 'Delete', 'Cancel', () => {
      this.deleteBatchConfirm(batch);
    }, () => {
      return;
    });
  }
  deleteBatchConfirm(batch: Batch): void {
    this.common.showSpinner();
    this.batchService.deleteBatch(batch.id!).subscribe({
      next: () => {
        this.common.showMessage( 'success', 'Success', 'Batch deleted successfully' );
        this.loadBatches();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage( 'error', 'Error', error?.error?.message || 'Failed to delete batch' );
        this.common.hideSpinner();
      }
    });
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

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.batches];

    // Filter by search term
    if (this.searchTerm?.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(batch =>
        batch.batchName?.toLowerCase().includes(search) ||
        batch.description?.toLowerCase().includes(search) ||
        batch.batchCode?.toLowerCase().includes(search)
      );
    }

    this.filteredBatches = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  viewBatchDetail(batch: Batch): void {
    if (batch.id) {
      this.router.navigate(['/batch', batch.id, 'detail']);
    }
  }
}
