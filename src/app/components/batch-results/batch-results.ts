import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchResultService } from '../../core/service/batch-result';
import { BatchService } from '../../core/service/batch';
import { QuizService } from '../../core/service/quiz';
import { BatchResult, StudentResult, Batch, Quiz } from '../../core/interface/interfaces';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Common } from '../../core/common/common';

type SortOption = 'highest-score' | 'lowest-score' | 'date-asc' | 'date-desc';

@Component({
  selector: 'app-batch-results',
  imports: [
    FormsModule,
    Select,
    InputText,
    // Toast
  ],
  templateUrl: './batch-results.html',
  styleUrl: './batch-results.scss',
  // providers: [MessageService]
})
export class BatchResults implements OnInit {
  private readonly batchResultService = inject(BatchResultService);
  private readonly batchService = inject(BatchService);
  private readonly quizService = inject(QuizService);
  private  common = inject(Common);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  batchId?: string;
  quizId?: string;
  batch?: Batch;
  quiz?: Quiz;
  batchResult?: BatchResult;
  studentResults: StudentResult[] = [];
  sortedResults: StudentResult[] = [];
  filteredResults: StudentResult[] = [];
  
  batches: Batch[] = [];
  quizzes: Quiz[] = [];
  selectedBatchId?: string;
  selectedQuizId?: string;
  
  sortOption: SortOption = 'highest-score';
  searchTerm: string = '';
  sortOptions = [
    { label: 'Highest Score', value: 'highest-score' },
    { label: 'Lowest Score', value: 'lowest-score' },
    { label: 'Date (Newest First)', value: 'date-desc' },
    { label: 'Date (Oldest First)', value: 'date-asc' }
  ];

  ngOnInit(): void {
    this.batchId = this.route.snapshot.params['batchId'];
    this.quizId = this.route.snapshot.queryParams['quizId'];
    
    this.loadBatches();
    if (this.batchId) {
      this.selectedBatchId = this.batchId;
      this.loadBatch();
      this.loadQuizzes();
      if (this.quizId) {
        this.selectedQuizId = this.quizId;
        this.loadResults();
      }
    }
  }

  loadBatch(): void {
    if (!this.batchId) return;
    this.batchService.getBatchById(this.batchId).subscribe({
      next: (batch) => {
        this.batch = batch;
      },
      error: (error) => {
        console.error('Error loading batch:', error);
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

  loadQuizzes(): void {
    if (!this.batchId) return;
    this.quizService.getQuizzesByBatch(this.batchId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
      }
    });
  }

  onBatchChange(): void {
    if (this.selectedBatchId) {
      this.batchId = this.selectedBatchId;
      this.loadBatch();
      this.loadQuizzes();
      this.selectedQuizId = undefined;
      this.batchResult = undefined;
      this.studentResults = [];
      this.sortedResults = [];
    }
  }

  onQuizChange(): void {
    if (this.selectedQuizId && this.selectedBatchId) {
      this.quizId = this.selectedQuizId;
      this.loadResults();
    }
  }

  loadResults(): void {
    if (!this.batchId || !this.quizId) return;
    
    this.common.showSpinner();
    this.batchResultService.getBatchResults(this.batchId, this.quizId).subscribe({
      next: (result) => {
        this.batchResult = result;
        this.studentResults = result.studentResults || [];
        this.searchTerm = ''; // Reset search when loading new results
        this.applySort();
        this.loadQuiz();
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.common.showMessage('error','Error',error?.error?.message || 'Failed to load results');
        this.common.hideSpinner();
      }
    });
  }

  loadQuiz(): void {
    if (!this.quizId) return;
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
      }
    });
  }

  onSortChange(): void {
    this.applySort();
  }

  applySort(): void {
    this.sortedResults = [...this.studentResults];
    
    switch (this.sortOption) {
      case 'highest-score':
        this.sortedResults.sort((a, b) => b.percentage - a.percentage);
        break;
      case 'lowest-score':
        this.sortedResults.sort((a, b) => a.percentage - b.percentage);
        break;
      case 'date-desc':
        this.sortedResults.sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'date-asc':
        this.sortedResults.sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
    }

    // Update ranks
    this.sortedResults.forEach((result, index) => {
      result.rank = index + 1;
    });

    // Apply search filter after sorting
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.sortedResults];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(result =>
        result.studentName?.toLowerCase().includes(search) ||
        result.studentEmail?.toLowerCase().includes(search)
      );
    }

    this.filteredResults = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  formatTime(seconds?: number): string {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }
}

