import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router } from '@angular/router';
import { Auth } from '../../core/service/auth';
import { UserInfo } from '../../core/interface/interfaces';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-dashboard',
  imports: [
    CardModule, 
    AvatarModule, 
    ButtonModule, 
    CommonModule, 
    TagModule, 
    TableModule, 
    ProgressBarModule,
    RouterModule,
    BadgeModule,
    DividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  
  currentUser: UserInfo | null = null;
  userRole: string = '';
  
  // Mock data - replace with actual API calls
  stats = {
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalQuestions: 0,
    totalStudents: 0,
    totalInstructors: 0,
    recentQuizzes: [] as any[],
    upcomingQuizzes: [] as any[],
    performanceData: [] as any[]
  };

  ngOnInit() {
    this.userRole = this.currentUser?.role || 'USER';
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load different data based on user role
    switch (this.userRole.toUpperCase()) {
      case 'STUDENT':
        this.loadStudentData();
        break;
      case 'INSTRUCTOR':
        this.loadInstructorData();
        break;
      case 'ADMIN':
        this.loadAdminData();
        break;
      default:
        this.loadUserData();
    }
  }

  loadStudentData() {
    this.stats = {
      totalQuizzes: 12,
      completedQuizzes: 8,
      averageScore: 85,
      totalQuestions: 0,
      totalStudents: 0,
      totalInstructors: 0,
      recentQuizzes: [
        { id: 1, title: 'JavaScript Fundamentals', score: 92, date: '2024-01-15', status: 'completed' },
        { id: 2, title: 'React Components', score: 78, date: '2024-01-14', status: 'completed' },
        { id: 3, title: 'Angular Services', score: 0, date: '2024-01-16', status: 'pending' }
      ],
      upcomingQuizzes: [
        { id: 4, title: 'TypeScript Advanced', date: '2024-01-18', duration: 30 },
        { id: 5, title: 'Node.js Backend', date: '2024-01-20', duration: 45 }
      ],
      performanceData: [
        { subject: 'JavaScript', score: 92, total: 100 },
        { subject: 'React', score: 78, total: 100 },
        { subject: 'Angular', score: 85, total: 100 }
      ]
    };
  }

  loadInstructorData() {
    this.stats = {
      totalQuizzes: 15,
      completedQuizzes: 0,
      averageScore: 0,
      totalQuestions: 120,
      totalStudents: 45,
      totalInstructors: 0,
      recentQuizzes: [
        { id: 1, title: 'JavaScript Fundamentals', participants: 25, avgScore: 82, date: '2024-01-15', status: 'active' },
        { id: 2, title: 'React Components', participants: 18, avgScore: 76, date: '2024-01-14', status: 'completed' },
        { id: 3, title: 'Angular Services', participants: 0, avgScore: 0, date: '2024-01-16', status: 'draft' }
      ],
      upcomingQuizzes: [],
      performanceData: [
        { subject: 'JavaScript', score: 82, total: 100 },
        { subject: 'React', score: 76, total: 100 },
        { subject: 'Angular', score: 0, total: 100 }
      ]
    };
  }

  loadAdminData() {
    this.stats = {
      totalQuizzes: 45,
      completedQuizzes: 0,
      averageScore: 0,
      totalQuestions: 350,
      totalStudents: 120,
      totalInstructors: 8,
      recentQuizzes: [
        { id: 1, title: 'JavaScript Fundamentals', participants: 45, avgScore: 82, date: '2024-01-15', status: 'active' },
        { id: 2, title: 'React Components', participants: 38, avgScore: 76, date: '2024-01-14', status: 'completed' },
        { id: 3, title: 'Angular Services', participants: 12, avgScore: 0, date: '2024-01-16', status: 'draft' }
      ],
      upcomingQuizzes: [],
      performanceData: [
        { subject: 'JavaScript', score: 82, total: 100 },
        { subject: 'React', score: 76, total: 100 },
        { subject: 'Angular', score: 68, total: 100 }
      ]
    };
  }

  loadUserData() {
    this.stats = {
      totalQuizzes: 5,
      completedQuizzes: 3,
      averageScore: 78,
      totalQuestions: 0,
      totalStudents: 0,
      totalInstructors: 0,
      recentQuizzes: [
        { id: 1, title: 'General Knowledge', score: 85, date: '2024-01-15', status: 'completed' },
        { id: 2, title: 'Science Quiz', score: 72, date: '2024-01-14', status: 'completed' },
        { id: 3, title: 'History Quiz', score: 0, date: '2024-01-16', status: 'pending' }
      ],
      upcomingQuizzes: [
        { id: 4, title: 'Math Challenge', date: '2024-01-18', duration: 20 },
        { id: 5, title: 'Literature Quiz', date: '2024-01-20', duration: 25 }
      ],
      performanceData: [
        { subject: 'General Knowledge', score: 85, total: 100 },
        { subject: 'Science', score: 72, total: 100 },
        { subject: 'History', score: 0, total: 100 }
      ]
    };
  }

  getRoleColor(role: string): string {
    switch (role.toUpperCase()) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800';
      case 'INSTRUCTOR': return 'bg-green-100 text-green-800';
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleIcon(role: string): string {
    switch (role.toUpperCase()) {
      case 'STUDENT': return 'pi pi-user';
      case 'INSTRUCTOR': return 'pi pi-users';
      case 'ADMIN': return 'pi pi-cog';
      default: return 'pi pi-user';
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.setLoggedOut();
        this.router.navigate(['/signin']);
      },
      error: () => {
        this.authService.setLoggedOut();
        this.router.navigate(['/signin']);
      }
    });
  }

  getCompletionPercentage(): number {
    if (this.stats.totalQuizzes === 0) return 0;
    return Math.round((this.stats.completedQuizzes / this.stats.totalQuizzes) * 100);
  }

  getActiveQuizzesCount(): number {
    return this.stats.recentQuizzes.filter((q: any) => q.status === 'active').length;
  }
}
