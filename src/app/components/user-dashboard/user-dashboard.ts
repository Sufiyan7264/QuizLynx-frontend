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
      title: 'Quizzes Taken',
      value: 24,
      change: 5,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Average Score',
      value: '82%',
      change: 8,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Quizzes Completed',
      value: 18,
      change: 3,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Current Streak',
      value: '7 days',
      change: 2,
      changeType: 'increase',
      period: 'Last 7 days'
    }
  ];

  // Progress Card
  progressData = {
    milestone: '50 Quizzes Completed',
    message: 'Great progress!',
    description: 'You have completed 50 quizzes and are improving your knowledge every day'
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
    labels: ['Excellent (90-100%)', 'Good (75-89%)', 'Average (60-74%)', 'Needs Improvement (<60%)'],
    series: [{
      name: 'My Performance',
      type: 'pie',
      radius: ['45%', '62%'],
      center: ['28%', '55%'], // shift pie further left to clear legend/text
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
        { value: 8, name: 'Excellent (90-100%)', itemStyle: { color: '#10b981' } },
        { value: 10, name: 'Good (75-89%)', itemStyle: { color: '#3b82f6' } },
        { value: 4, name: 'Average (60-74%)', itemStyle: { color: '#f59e0b' } },
        { value: 2, name: 'Needs Improvement (<60%)', itemStyle: { color: '#ef4444' } }
      ]
    }]
  };

  performanceChartOptions: ChartOptions = {
    // title: {
    //   // text: 'My Performance Breakdown',
    //   left: 'left',
    //   top: '0%',
    //   textStyle: {
    //     fontSize: 16,
    //     fontWeight: '600',
    //     color: '#0b1220'
    //   }
    // },
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
      textStyle: {
        fontSize: 10,
        color: '#0b1220'
      },
      formatter: this.formatLegend.bind(this)
    },
    graphic: [{
      type: 'text',
      left: '18%',
      top: '52%',
      z: 10,
      style: {
        text: 'Total quizzes\n24',
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
      'Excellent (90-100%)': 8,
      'Good (75-89%)': 10,
      'Average (60-74%)': 4,
      'Needs Improvement (<60%)': 2
    };
    return `${name} ${dataMap[name] || 0}/24`;
  }

  // Practice Suggestion
  practiceSuggestion = {
    score: '5/15',
    subject: 'Computer Science',
    message: 'Keep practising! Improve your confidence in Computer Science by practicing another quiz'
  };

  totalQuizzes = 24;
}
