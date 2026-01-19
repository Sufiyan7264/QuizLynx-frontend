import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  private readonly router = inject(Router);
  features = [
    {
      icon: 'pi pi-sparkles',
      title: 'AI-Powered Questions',
      description: 'Generate quizzes instantly using AI. Just describe the topic and get quality questions.',
      badge: 'Smart'
    },
    {
      icon: 'pi pi-chart-bar',
      title: 'Real-time Analytics',
      description: 'Track student progress with detailed insights and performance breakdowns.',
      badge: 'Insights'
    },
    {
      icon: 'pi pi-users',
      title: 'Classroom Batches',
      description: 'Create private batches for your class. Manage students and assign quizzes easily.',
      badge: 'Organize'
    },
    {
      icon: 'pi pi-trophy',
      title: 'Leaderboards',
      description: 'Gamified learning with global rankings. Motivate students to compete and improve.',
      badge: 'Compete'
    }
  ];
  steps = [
    { number: '01', icon: 'pi pi-user-plus', title: 'Sign Up', description: 'Create your free account as a student, instructor, or individual learner.' },
    { number: '02', icon: 'pi pi-plus-circle', title: 'Create or Join', description: 'Build quizzes with AI or join an instructor\'s batch to start learning.' },
    { number: '03', icon: 'pi pi-chart-line', title: 'Track Progress', description: 'Monitor performance, maintain streaks, and climb the leaderboard.' }
  ];
  roles = [
    {
      type: 'student',
      badge: 'For Students',
      icon: 'pi pi-graduation-cap',
      title: 'Learn & Compete',
      description: 'Join batches, take quizzes, and track your progress with detailed analytics.',
      features: [
        'Join instructor batches',
        'Track quiz history',
        'Compete on leaderboards',
        'View performance analytics'
      ]
    },
    {
      type: 'instructor',
      badge: 'For Instructors',
      icon: 'pi pi-briefcase',
      title: 'Teach & Track',
      description: 'Create batches, assign quizzes, and monitor your students\' performance.',
      features: [
        'Create classroom batches',
        'AI-powered quiz generation',
        'Monitor student progress',
        'Export detailed reports'
      ]
    },
    {
      type: 'individual',
      badge: 'For Individual Users',
      icon: 'pi pi-bolt',
      title: 'Practice & Grow',
      description: 'Self-paced learning with access to public quizzes and personal analytics.',
      features: [
        'Access public quizzes',
        'Practice any topic',
        'Track personal streaks',
        'Compete globally'
      ]
    }
  ];

  tryQuizlynx() {
    this.router.navigate(['/signin']);
  }

  register() {
    this.router.navigate(['/register']);
  }
}