import { Component, OnInit, inject } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from '../common/chart-configuration/chart-configuration';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../core/service/user';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  subject: string;
  avatar?: string;
  totalQuizzes: number;
  averageScore: number;
  lastActive: string;
}

interface InstructorQuiz {
  id: string;
  title: string;
  instructorName: string;
  subject: string;
  dueDate: string;
  status: 'Completed' | 'Pending' | 'Overdue';
  score?: string;
  maxScore?: string;
}

interface InstructorFeedback {
  id: string;
  instructorName: string;
  quizTitle: string;
  feedback: string;
  date: string;
  rating?: number;
}

interface InstructorAnnouncement {
  id: string;
  instructorName: string;
  title: string;
  message: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-student-instructor-dashboard',
  imports: [ChartConfiguration, ButtonModule],
  templateUrl: './student-instructor-dashboard.html',
  styleUrl: './student-instructor-dashboard.scss'
})
export class StudentInstructorDashboard implements OnInit {
  stats: StatCard[] = [];
  instructors: Instructor[] = [];
  instructorQuizzes: InstructorQuiz[] = [];
  instructorFeedback: InstructorFeedback[] = [];
  instructorAnnouncements: InstructorAnnouncement[] = [];
  performanceComparisonData: ChartData = {
    labels: ['My Score', 'Class Average'],
    series: [{
      name: 'Performance',
      type: 'bar',
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
      },
      data: [
        { value: 0, name: 'My Score', itemStyle: { color: '#3b82f6' } },
        { value: 0, name: 'Class Average', itemStyle: { color: '#10b981' } }
      ]
    }]
  };

  performanceComparisonOptions: ChartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'category',
      data: ['My Score', 'Class Average']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'var(--color-border)',
          type: 'dashed'
        }
      }
    }
  };
  quizCompletionData: ChartData = {
    labels: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez', 'Prof. David Kim'],
    series: [{
      name: 'Quizzes Completed',
      type: 'pie',
      radius: ['40%', '70%'],
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
        { value: 0, itemStyle: { color: '#3b82f6' } },
        { value: 0, itemStyle: { color: '#10b981' } },
        { value: 0, itemStyle: { color: '#f59e0b' } },
        { value: 0, itemStyle: { color: '#ef4444' } }
      ]
    }]
  };

  quizCompletionOptions: ChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} quizzes ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: '5%',
      itemGap: 15,
      textStyle: {
        fontSize: 12,
        color: '#0b1220'
      }
    }
  };
  private readonly studentService = inject(UserService);
  ngOnInit() {
    this.studentService.getDashboard().subscribe(data => {
      this.stats = data.stats;
      this.instructors = data.instructors;
      this.instructorQuizzes = data.instructorQuizzes;
      this.instructorFeedback = data.instructorFeedback;
      this.instructorAnnouncements = data.instructorAnnouncements;
      this.performanceComparisonData = data.performanceComparison;
      this.quizCompletionData = data.quizCompletion;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Pending':
        return 'pending';
      case 'Overdue':
        return 'overdue';
      default:
        return '';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'Overdue':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  }

  getPriorityClass(priority: string): string {
    return priority;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

