import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../core/service/student';
import { QuizService } from '../../core/service/quiz';
import { BatchService } from '../../core/service/batch';
import { Student, Quiz, Batch } from '../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-batch-detail',
  imports: [
    FormsModule,
    InputText,
  ],
  templateUrl: './batch-detail.html',
  styleUrl: './batch-detail.scss',
})
export class BatchDetail implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly quizService = inject(QuizService);
  private readonly batchService = inject(BatchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly common = inject(Common);

  batchId?: string;
  batch?: Batch;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  studentSearchTerm: string = '';
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  quizSearchTerm: string = '';

  activeTab: 'students' | 'quizzes' = 'students';

  ngOnInit(): void {
    this.batchId = this.route.snapshot.params['batchId'];
    if (this.batchId) {
      this.loadBatch();
      this.loadStudents();
      this.loadQuizzes();
    }
  }

  loadBatch(): void {
    if (!this.batchId) return;
    this.common.showSpinner();
    this.batchService.getBatchById(this.batchId).subscribe({
      next: (batch) => {
        this.batch = batch;
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load batch');
        this.common.hideSpinner();
      }
    });
  }

  loadStudents(): void {
    if (!this.batchId) return;
    this.common.showSpinner();
    this.studentService.getStudentsByBatch(this.batchId).subscribe({
      next: (students) => {
        this.students = students;
        this.applyStudentFilters();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load students');
        this.common.hideSpinner();
      }
    });
  }

  loadQuizzes(): void {
    if (!this.batchId) return;
    this.quizService.getQuizzesByBatch(this.batchId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.applyQuizFilters();
      },
      error: (error) => {
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load quizzes');
      }
    });
  }

  onStudentSearchChange(): void {
    this.applyStudentFilters();
  }

  onQuizSearchChange(): void {
    this.applyQuizFilters();
  }

  applyStudentFilters(): void {
    let filtered = [...this.students];

    if (this.studentSearchTerm?.trim()) {
      const search = this.studentSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(student =>
        student.username?.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search) ||
        student.firstName?.toLowerCase().includes(search) ||
        student.lastName?.toLowerCase().includes(search) ||
        `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().includes(search)
      );
    }

    this.filteredStudents = filtered;
  }

  applyQuizFilters(): void {
    let filtered = [...this.quizzes];

    if (this.quizSearchTerm?.trim()) {
      const search = this.quizSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(quiz =>
        quiz.title?.toLowerCase().includes(search) ||
        quiz.description?.toLowerCase().includes(search) ||
        quiz.subject?.toLowerCase().includes(search)
      );
    }

    this.filteredQuizzes = filtered;
  }

  clearStudentSearch(): void {
    this.studentSearchTerm = '';
    this.applyStudentFilters();
  }

  clearQuizSearch(): void {
    this.quizSearchTerm = '';
    this.applyQuizFilters();
  }

  setActiveTab(tab: 'students' | 'quizzes'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/instructor/batches']);
  }

  viewQuizResults(quiz: Quiz): void {
    if (quiz.id && this.batchId) {
      this.router.navigate(['/batch', this.batchId, 'results'], { queryParams: { quizId: quiz.id } });
    }
  }

  getStudentDisplayName(student: Student): string {
    if (student.firstName || student.lastName) {
      return `${student.firstName || ''} ${student.lastName || ''}`.trim();
    }
    return student.name || student.email || 'Unknown Student';
  }

  getStudentInitials(student: Student): string {
    const name = this.getStudentDisplayName(student);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  formatDisplayDate(dateString?: string): string {
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

