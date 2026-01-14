import { Component, OnInit, inject } from '@angular/core';
import { StudentService } from '../../core/service/student';
import { BatchService } from '../../core/service/batch';
import { Student, Batch } from '../../core/interface/interfaces';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-instructor-students',
  imports: [
    FormsModule,
    Select,
    InputText,
    // Toast
  ],
  templateUrl: './instructor-students.html',
  styleUrl: './instructor-students.scss',
})
export class InstructorStudents implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly batchService = inject(BatchService);
  private readonly common = inject(Common);

  students: Student[] = [];
  filteredStudents: Student[] = [];
  batches: Batch[] = [];
  selectedBatchId: string | null = null;
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadBatches();
    this.loadStudents();
  }

  loadStudents(): void {
    this.common.showSpinner();
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.applyFilters();
        this.common.hideSpinner();
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load students');
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
        this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to load batches');
        this.common.hideSpinner();
      }
    });
  }

  onBatchFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.students];
    console.log(filtered)
    // Filter by batch
    if (this.selectedBatchId) {
      filtered = filtered.filter(student => 
        student.enrolledBatches?.includes(this.selectedBatchId!) ||
        student.batchNames?.some(name => 
          this.batches.find(b => b.id === this.selectedBatchId && b.batchName === name)
        )
      );
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
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

  clearFilters(): void {
    this.selectedBatchId = null;
    this.searchTerm = '';
    this.applyFilters();
  }

  getStudentDisplayName(student: Student): string {
    if (student.firstName || student.lastName) {
      return `${student.firstName || ''} ${student.lastName || ''}`.trim();
    }
    return student.username || student.email || 'Unknown Student';
  }

  getStudentInitials(student: Student): string {
    const name = this.getStudentDisplayName(student);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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

  getBatchNames(student: Student): string {
    if (student.batchNames && student.batchNames.length > 0) { 
      return student.batchNames.join(', ');
    }
    if (student.enrolledBatches && student.enrolledBatches.length > 0) {
      const names = student.enrolledBatches
        .map(batchId => this.batches.find(b => b.batchName === batchId)?.batchName)
        .filter(name => name)
        .join(', ');
      return names || 'No batches';
    }
    return 'No batches';
  }
}

