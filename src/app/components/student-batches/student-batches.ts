import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BatchService } from '../../core/service/batch';
import { Batch } from '../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
// import { Toast } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-student-batches',
  imports: [
    FormsModule,
    InputText,
    // Toast
  ],
  templateUrl: './student-batches.html',
  styleUrl: './student-batches.scss',
})
export class StudentBatches implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly router = inject(Router);
  private readonly common = inject(Common);

  batches: Batch[] = [];
  filteredBatches: Batch[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.common.showSpinner();
    this.batchService.getStudentBatches().subscribe({
      next: (batches) => {
        this.batches = batches;
        this.applyFilters();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load batches');
        this.common.hideSpinner();
      }
    });
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

  navigateToJoin(): void {
    this.router.navigate(['/student/join']);
  }

  viewBatchQuizzes(batch: Batch): void {
    if (batch.id) {
      this.router.navigate(['/batch', batch.id, 'quizzes']);
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
}

