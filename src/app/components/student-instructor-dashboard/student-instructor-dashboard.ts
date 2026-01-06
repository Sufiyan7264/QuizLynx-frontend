import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, ChartConfiguration, ButtonModule],
  templateUrl: './student-instructor-dashboard.html',
  styleUrl: './student-instructor-dashboard.scss'
})
export class StudentInstructorDashboard {
  // Statistics Cards
  stats: StatCard[] = [
    {
      title: 'My Instructors',
      value: 4,
      change: 1,
      changeType: 'increase',
      period: 'This semester'
    },
    {
      title: 'Instructor Quizzes',
      value: 18,
      change: 5,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Average Score',
      value: '85%',
      change: 3,
      changeType: 'increase',
      period: 'Last 7 days'
    },
    {
      title: 'Pending Quizzes',
      value: 5,
      change: -2,
      changeType: 'decrease',
      period: 'Last 7 days'
    }
  ];

  // My Instructors
  instructors: Instructor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      subject: 'Mathematics',
      totalQuizzes: 12,
      averageScore: 88,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      subject: 'Computer Science',
      totalQuizzes: 15,
      averageScore: 92,
      lastActive: '5 hours ago'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@university.edu',
      subject: 'English Literature',
      totalQuizzes: 8,
      averageScore: 85,
      lastActive: '1 day ago'
    },
    {
      id: '4',
      name: 'Prof. David Kim',
      email: 'david.kim@university.edu',
      subject: 'Physics',
      totalQuizzes: 10,
      averageScore: 80,
      lastActive: '3 days ago'
    }
  ];

  // Instructor Quizzes
  instructorQuizzes: InstructorQuiz[] = [
    {
      id: '1',
      title: 'Algebra Fundamentals',
      instructorName: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      dueDate: '2024-01-15',
      status: 'Completed',
      score: '42',
      maxScore: '50'
    },
    {
      id: '2',
      title: 'Data Structures Quiz',
      instructorName: 'Prof. Michael Chen',
      subject: 'Computer Science',
      dueDate: '2024-01-18',
      status: 'Pending'
    },
    {
      id: '3',
      title: 'Shakespeare Analysis',
      instructorName: 'Dr. Emily Rodriguez',
      subject: 'English Literature',
      dueDate: '2024-01-12',
      status: 'Completed',
      score: '38',
      maxScore: '45'
    },
    {
      id: '4',
      title: 'Quantum Mechanics Basics',
      instructorName: 'Prof. David Kim',
      subject: 'Physics',
      dueDate: '2024-01-10',
      status: 'Overdue'
    },
    {
      id: '5',
      title: 'Calculus Advanced',
      instructorName: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      dueDate: '2024-01-20',
      status: 'Pending'
    }
  ];

  // Instructor Feedback
  instructorFeedback: InstructorFeedback[] = [
    {
      id: '1',
      instructorName: 'Dr. Sarah Johnson',
      quizTitle: 'Algebra Fundamentals',
      feedback: 'Excellent work! Your understanding of algebraic concepts is very strong. Keep up the great work!',
      date: '2024-01-10',
      rating: 5
    },
    {
      id: '2',
      instructorName: 'Prof. Michael Chen',
      quizTitle: 'Data Structures Quiz',
      feedback: 'Good progress! Consider reviewing linked lists and binary trees for the next quiz.',
      date: '2024-01-08',
      rating: 4
    },
    {
      id: '3',
      instructorName: 'Dr. Emily Rodriguez',
      quizTitle: 'Shakespeare Analysis',
      feedback: 'Well done! Your analysis shows deep understanding of the themes. Try to include more textual evidence.',
      date: '2024-01-05',
      rating: 4
    }
  ];

  // Instructor Announcements
  instructorAnnouncements: InstructorAnnouncement[] = [
    {
      id: '1',
      instructorName: 'Prof. Michael Chen',
      title: 'New Quiz Available',
      message: 'A new quiz on "Advanced Algorithms" is now available. Please complete it by Friday.',
      date: '2024-01-14',
      priority: 'high'
    },
    {
      id: '2',
      instructorName: 'Dr. Sarah Johnson',
      title: 'Office Hours Update',
      message: 'Office hours this week will be held on Wednesday from 2-4 PM instead of the usual time.',
      date: '2024-01-13',
      priority: 'medium'
    },
    {
      id: '3',
      instructorName: 'Dr. Emily Rodriguez',
      title: 'Reading Assignment',
      message: 'Please read chapters 5-7 of "Literary Analysis" before the next class.',
      date: '2024-01-12',
      priority: 'low'
    }
  ];

  // Performance Comparison Chart
  performanceComparisonData: ChartData = {
    labels: ['My Score', 'Class Average'],
    series: [{
      name: 'Performance',
      type: 'bar',
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
      },
      data: [
        { value: 85, name: 'My Score', itemStyle: { color: '#3b82f6' } },
        { value: 78, name: 'Class Average', itemStyle: { color: '#10b981' } }
      ]
    }]
  };

  performanceComparisonOptions: ChartOptions = {
    title: {
      text: 'My Performance vs Class Average',
      left: 'center',
      top: '0%',
      textStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0b1220'
      }
    },
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

  // Quiz Completion by Instructor Chart
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
        { value: 12, name: 'Dr. Sarah Johnson', itemStyle: { color: '#3b82f6' } },
        { value: 15, name: 'Prof. Michael Chen', itemStyle: { color: '#10b981' } },
        { value: 8, name: 'Dr. Emily Rodriguez', itemStyle: { color: '#f59e0b' } },
        { value: 10, name: 'Prof. David Kim', itemStyle: { color: '#ef4444' } }
      ]
    }]
  };

  quizCompletionOptions: ChartOptions = {
    title: {
      text: 'Quizzes by Instructor',
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
  private studentService = inject(UserService);
  ngOnInit() {
    this.studentService.getDashboard().subscribe(data => {
        this.stats = data.stats;
        this.instructors = data.instructors;
        this.instructorQuizzes = data.instructorQuizzes;
        this.instructorFeedback = data.instructorFeedback;
        this.instructorAnnouncements = data.instructorAnnouncements;
 
        // Map charts
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

