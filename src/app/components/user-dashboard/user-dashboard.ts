import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions } from '../common/chart-configuration/chart-configuration';
import { ButtonModule } from 'primeng/button';

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
export class UserDashboard {
  // Statistics Cards
  stats: StatCard[] = [
    {
      title: 'Total quizzes created',
      value: 45,
      change: 15,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Active students',
      value: 234,
      change: 12,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Average completion rate',
      value: '87%',
      change: 5,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Students enrolled',
      value: 156,
      change: 8,
      changeType: 'increase',
      period: 'Last 7 days'
    }
  ];

  // Progress Card
  progressData = {
    milestone: '100 Quizzes Created',
    message: 'Outstanding achievement!',
    description: 'You have successfully created 100 quizzes and helped countless students learn'
  };

  // Quiz History
  quizHistory: QuizHistoryItem[] = [
    {
      subject: 'English',
      score: '10/15',
      status: 'Completed',
      actions: { refresh: true, folder: true }
    },
    {
      subject: 'English',
      score: '10/15',
      status: 'Completed',
      actions: { refresh: true, folder: true }
    },
    {
      subject: 'English',
      score: '-',
      status: 'Unattempted',
      actions: { warning: true, folder: true }
    },
  ];

  // Overall Performance Chart (Donut Chart)
  performanceChartData: ChartData = {
    labels: ['Completed', 'In progress', 'Scores over 90%'],
    series: [{
      name: 'Quiz Performance',
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#fff',
        borderWidth: 0
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      emphasis: {
        label: {
          show: false
        }
      },
      data: [
        { value: 375, name: 'Completed', itemStyle: { color: '#3b82f6' } },
        { value: 375, name: 'In progress', itemStyle: { color: '#e5e7eb' } },
        { value: 375, name: 'Scores over 90%', itemStyle: { color: '#fbbf24' } }
      ]
    }]
  };

  performanceChartOptions: ChartOptions = {
    title: {
      text: 'Overall quiz performance',
      left: 'center',
      top: '0%',
      textStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0b1220'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: '5%',
      itemGap: 15,
      textStyle: {
        fontSize: 13,
        color: '#0b1220'
      },
      formatter: this.formatLegend.bind(this)
    },
    graphic: [{
      type: 'text',
      left: 'center',
      top: 'center',
      z: 10,
      style: {
        text: 'Total quizzes\n1500',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Mona Sans, sans-serif',
        fill: '#0b1220',
        textAlign: 'center',
        textVerticalAlign: 'middle'
      }
    }]
  };

  private formatLegend(name: string): string {
    const dataMap: { [key: string]: number } = {
      'Completed': 375,
      'In progress': 375,
      'Scores over 90%': 375
    };
    return `${name} ${dataMap[name] || 0}/1500`;
  }

  // Practice Suggestion
  practiceSuggestion = {
    score: '5/15',
    subject: 'Computer Science',
    message: 'Keep practising! Improve your confidence in Computer Science by practicing another quiz'
  };

  totalQuizzes = 1500;
}
