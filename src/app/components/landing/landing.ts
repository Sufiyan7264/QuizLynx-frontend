import { Component, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [], // Add CommonModule if not standalone default, but empty is usually fine in newer Angular
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit, AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private animatedElements = new Set<string>();
  private readonly router = inject(Router);

  // Updated Stats
  stats = [
    { value: '10K+', label: 'Active Learners' },
    { value: '500+', label: 'Tech Quizzes' },
    { value: '50+', label: 'Countries' },
    { value: '4.9', label: 'User Rating' }
  ];

  // Updated Features to match your implementation
  features = [
    {
      icon: '🏆',
      title: 'Global Leaderboard',
      description: 'Compete with developers worldwide. Rank up by solving quizzes with speed and accuracy.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track your "Mistakes" and "Attempts". Review detailed reports to identify weak spots in Java, Python, or SQL.'
    },
    {
      icon: '🎓',
      title: 'Classroom Batches',
      description: 'Instructors can create private batches, assign quizzes, and monitor student performance in real-time.'
    },
    {
      icon: '🔐',
      title: 'Secure & Safe',
      description: 'Built with industry-standard security (JWT, HttpOnly Cookies) to keep your data and progress safe.'
    },
    {
      icon: '⚡',
      title: 'Tech Stack Focused',
      description: 'Curated categories for Java, Spring Boot, Angular, and more. Perfect for interview prep.'
    },
    {
      icon: '📱',
      title: 'Cross Platform',
      description: 'Seamless experience on mobile and desktop. Learn on the go or deep dive at your desk.'
    }
  ];

  // Methods
  tryQuizlynx() {
    this.router.navigate(['/signin']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    this.setupScrollAnimations();
    // Initial hero animation trigger
    setTimeout(() => {
      const heroElements = document.querySelectorAll('section:first-of-type [data-animate]');
      heroElements.forEach((el, index) => {
        setTimeout(() => el.classList.add('animate-in'), index * 150);
      });
    }, 100);
  }

  ngAfterViewInit() {}

  setupScrollAnimations() {
    const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-animate');
          // Note: Removing the 'has' check allows re-animation if you want, 
          // but keeping it ensures it only animates once per session
          if (elementId && !this.animatedElements.has(elementId)) {
            this.animatedElements.add(elementId);
            this.animateElement(entry.target as HTMLElement);
          }
        }
      });
    }, options);

    setTimeout(() => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(el => this.observer.observe(el));
    }, 100);
  }

  private animateElement(element: HTMLElement) {
    element.classList.add('animate-in');
    
    // Animate children (cards)
    const cards = element.querySelectorAll('.feature-card, .stat-card, .faq-item');
    cards.forEach((card, index) => {
      setTimeout(() => card.classList.add('animate-in'), index * 100);
    });
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
  }
}