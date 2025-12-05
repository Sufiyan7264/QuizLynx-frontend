import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions } from '../common/chart-configuration/chart-configuration';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface TopStudent {
  name: string;
  averageScore: number;
  quizzesCompleted: number;
  status: string;
}

interface StudentNeedingAttention {
  name: string;
  score: number;
  quizzesCompleted: number;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ChartConfiguration],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {
  // Statistics Cards
  stats: StatCard[] = [
    {
      title: 'Total Students',
      value: 156,
      change: 12,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Active Students',
      value: 134,
      change: 8,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Average Score',
      value: '87%',
      change: 5,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Top Performers',
      value: 42,
      change: 15,
      changeType: 'increase',
      period: 'Last 7 days'
    }
  ];

  // Top Performing Students
  topStudents: TopStudent[] = [
    {
      name: 'Sarah Johnson',
      averageScore: 96,
      quizzesCompleted: 12,
      status: 'Excellent'
    },
    {
      name: 'Michael Chen',
      averageScore: 94,
      quizzesCompleted: 11,
      status: 'Excellent'
    },
    {
      name: 'Emily Rodriguez',
      averageScore: 92,
      quizzesCompleted: 10,
      status: 'Excellent'
    },
    {
      name: 'David Kim',
      averageScore: 89,
      quizzesCompleted: 9,
      status: 'Good'
    },
    {
      name: 'Jessica Martinez',
      averageScore: 87,
      quizzesCompleted: 8,
      status: 'Good'
    },
    {
      name: 'James Wilson',
      averageScore: 85,
      quizzesCompleted: 7,
      status: 'Good'
    }
  ];

  // Students Needing Attention
  studentsNeedingAttention: StudentNeedingAttention[] = [
    {
      name: 'Alex Thompson',
      score: 58,
      quizzesCompleted: 3
    },
    {
      name: 'Maria Garcia',
      score: 62,
      quizzesCompleted: 4
    },
    {
      name: 'Robert Brown',
      score: 65,
      quizzesCompleted: 5
    }
  ];

  // Quick Statistics
  quickStats = {
    totalStudents: 156,
    topPerformers: 42,
    averageCompletionTime: '18 min',
    averageScore: 87
  };
  // Line Chart Data - Student Engagement Over Time
  studentEngagementData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Active Students',
      data: [45, 52, 48, 61, 55, 38, 42]
    }, {
      label: 'Quiz Completions',
      data: [28, 35, 32, 41, 38, 25, 30]
    }]
  };

  studentEngagementOptions: ChartOptions = {
    title: {
      text: 'Student Engagement Over Time',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Active Students', 'Quiz Completions'],
      top: '12%'
    },
    grid: {
      top: '25%',
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true
    }
  };

  // Bar Chart Data - Student Performance by Quiz
  studentPerformanceData: ChartData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
    datasets: [{
      label: 'Average Score (%)',
      data: [87, 82, 91, 79, 88]
    }]
  };

  studentPerformanceOptions: ChartOptions = {
    title: {
      text: 'Student Performance by Quiz',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '20%',
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true
    }
  };

  // Pie Chart Data - Quiz Completion Status
  quizCompletionData: ChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [245, 78, 45]
    }],
    series: [{
      name: 'Quiz Completion Status',
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 0,
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        fontSize: 11,
        position: 'outside',
        textBorderColor: 'transparent',
        textBorderWidth: 0,
        textStyle: {
          textBorderColor: 'transparent',
          textBorderWidth: 0
        }
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 8
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold',
          textBorderColor: 'transparent',
          textBorderWidth: 0,
          textStyle: {
            textBorderColor: 'transparent',
            textBorderWidth: 0
          }
        }
      },
      data: [
        { value: 245, name: 'Completed' },
        { value: 78, name: 'In Progress' },
        { value: 45, name: 'Not Started' }
      ]
    }]
  };

  quizCompletionOptions: ChartOptions = {
    title: {
      text: 'Quiz Completion Status',
      left: 'center',
      top: '3%',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '2%',
      left: 'center',
      itemGap: 15
    }
  };

  // Performance Summary Chart
  performanceSummaryData: ChartData = {
    labels: ['90-100%', '75-89%', '60-74%', 'Below 60%'],
    datasets: [{
      data: [42, 68, 32, 14]
    }],
    series: [{
      name: 'Performance Distribution',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 0,
      },
      label: {
        show: true,
        formatter: '{b}: {c}',
        fontSize: 11,
        position: 'outside'
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 5
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 42, name: '90-100%', itemStyle: { color: '#10b981' } },
        { value: 68, name: '75-89%', itemStyle: { color: '#3b82f6' } },
        { value: 32, name: '60-74%', itemStyle: { color: '#f59e0b' } },
        { value: 14, name: 'Below 60%', itemStyle: { color: '#ef4444' } }
      ]
    }]
  };

  performanceSummaryOptions: ChartOptions = {
    title: {
      text: 'Student Performance Distribution',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 14,
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} students ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: '5%',
      itemGap: 10,
      textStyle: {
        fontSize: 12
      }
    }
  };
}
