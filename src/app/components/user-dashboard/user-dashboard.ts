import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions } from '../common/chart-configuration/chart-configuration';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../core/service/user';
import { Router } from '@angular/router';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface QuizHistoryItem {
  subject: string;
  score: string;
  status: 'Completed' | 'Unattempted';
  actions: {
    refresh?: boolean;
    folder?: boolean;
    warning?: boolean;
  };
}

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, ChartConfiguration, ButtonModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboard implements OnInit { 
  
  private router = inject(Router);

  // --- 3. Initialize Variables (Empty or Default) ---
  stats: StatCard[] = []; // Start empty, will fill from API
  quizHistory: QuizHistoryItem[] = [];
  lastActiveQuizId: number | null = null;
  totalQuizzes = 0;

  progressData = {
    milestone: 'Loading...',
    message: 'Please wait',
    description: 'Fetching your progress...'
  };

  // Keep your default chart structure, data will be overwritten
  performanceChartData: ChartData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    series: []
  };

  // Keep your options as they are
  performanceChartOptions: ChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} quizzes ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '0%',
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      padding: [0, 0, 0, 0],
      itemGap: 15,
      textStyle: { fontSize: 10, color: '#0b1220' },
      formatter: this.formatLegend.bind(this)
    },
    graphic: [{
      type: 'text',
      left: '18%', top: '52%', z: 10,
      style: {
        text: 'Total\nLoading', // Will update this dynamically
        fontSize: 12, fontWeight: 'bold', fontFamily: 'Mona Sans, sans-serif',
        fill: '#0b1220', textAlign: 'center', textVerticalAlign: 'middle'
      }
    }]
  };

  practiceSuggestion = {
    score: '-',
    subject: '-',
    message: 'Analyzing your performance...'
  };
  private user = inject(UserService);

  // --- 4. Add ngOnInit ---
  ngOnInit() {
    this.fetchDashboardData();
  }

  // --- 5. Add the API Method ---
  fetchDashboardData() {
    this.user.getDashboardData()
      .subscribe({
        next: (data) => {
          this.updateStats(data);
          this.updateHistory(data);
          this.updateChart(data);
          this.updateProgress(data);
          
          this.lastActiveQuizId = data.lastActiveQuizId;
          this.totalQuizzes = data.totalQuizzesTaken;

          // Update the "Total" text in the center of the donut chart
          this.updateChartGraphic(data.totalQuizzesTaken);
        },
        error: (err:any) => {

        }
      });
  }

  // --- 6. Add Helper Methods (Paste these below fetchDashboardData) ---

  resumeQuiz() {
    if (this.lastActiveQuizId) {
      this.router.navigate(['/quiz/attempt', this.lastActiveQuizId]);
    } else {
      this.router.navigate(['/student/quizzes']); 
    }
  }

  private updateStats(data: any) {
    this.stats = [
      {
        title: 'Quizzes Taken',
        value: data.totalQuizzesTaken,
        change: 0, changeType: 'increase', period: 'All Time'
      },
      {
        title: 'Average Score',
        value: data.averageScore,
        change: 0, changeType: 'increase', period: 'Overall'
      },
      {
        title: 'Completed',
        value: data.completedQuizzes,
        change: 0, changeType: 'increase', period: 'All Time'
      },
      {
        title: 'Current Streak',
        value: data.currentStreak,
        change: 0, changeType: 'increase', period: 'Active'
      }
    ];
  }

  private updateHistory(data: any) {
    this.quizHistory = data.recentHistory.map((h: any) => ({
      subject: h.subject,
      score: h.score,
      status: h.status,
      actions: { refresh: true, folder: true }
    }));
  }

  private updateProgress(data: any) {
    if (data.completedQuizzes > 0) {
      this.progressData = {
        milestone: `${data.completedQuizzes} Quizzes Completed`,
        message: 'Great progress!',
        description: `You have an average score of ${data.averageScore}`
      };
    } else {
      this.progressData = {
        milestone: 'Welcome!',
        message: 'Start your journey',
        description: 'Take your first quiz to see stats here.'
      };
    }
  }

  private updateChart(data: any) {
    this.performanceChartData = {
      labels: ['Excellent (90-100%)', 'Good (75-89%)', 'Average (60-74%)', 'Needs Improvement (<60%)'],
      series: [{
        name: 'My Performance',
        type: 'pie',
        radius: ['45%', '62%'],
        center: ['28%', '55%'],
        avoidLabelOverlap: false,
        label: { show: false },
        itemStyle: { borderRadius: 0, borderColor: '#fff', borderWidth: 0 },
        data: [
          { value: data.excellentCount, name: 'Excellent (90-100%)', itemStyle: { color: '#10b981' } },
          { value: data.goodCount, name: 'Good (75-89%)', itemStyle: { color: '#3b82f6' } },
          { value: data.averageCount, name: 'Average (60-74%)', itemStyle: { color: '#f59e0b' } },
          { value: data.poorCount, name: 'Needs Improvement (<60%)', itemStyle: { color: '#ef4444' } }
        ]
      }]
    };
  }

  private updateChartGraphic(total: number) {
    if (this.performanceChartOptions['graphic']) {
      (this.performanceChartOptions['graphic'] as any)[0].style.text = `Total quizzes\n${total}`;
    }
  }

  private formatLegend(name: string): string {
    // You can make this dynamic if needed, but for now simple return is safer
    return name; 
  }
}