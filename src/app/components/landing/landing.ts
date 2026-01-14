import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit, AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private animatedElements = new Set<string>();
  private readonly router = inject(Router)
  // Statistics data
  stats = [
    { value: '2M+', label: 'Active Users', color: 'purple' },
    { value: '50K+', label: 'Quiz Questions', color: 'blue' },
    { value: '100+', label: 'Categories', color: 'purple' },
    { value: '4.9★', label: 'User Rating', color: 'blue' }
  ];

  // Testimonials data
  testimonials = [
    {
      name: 'Sarah Johnson',
      initial: 'S',
      rating: 5,
      comment: 'Quizlynx has completely transformed my learning experience. The variety of quizzes keeps me engaged and helps me retain information better!',
      color: 'purple'
    },
    {
      name: 'Mike Chen',
      initial: 'M',
      rating: 5,
      comment: 'The Mind Bender challenges are incredible! They\'ve helped me improve my problem-solving skills significantly.',
      color: 'blue'
    },
    {
      name: 'Emily Rodriguez',
      initial: 'E',
      rating: 5,
      comment: 'Perfect for quick learning sessions during my commute. The interface is intuitive and the questions are well-crafted.',
      color: 'purple'
    }
  ];

  // FAQ data
  faqs = [
    {
      question: 'How do I get started with Quizlynx?',
      answer: 'Simply download the app, create your account, and start exploring our vast collection of quizzes. No subscription required for basic features!'
    },
    {
      question: 'Are the quizzes suitable for all ages?',
      answer: 'Yes! We have quizzes designed for different age groups and skill levels, from beginner to expert. Each quiz is clearly labeled with its difficulty level.'
    },
    {
      question: 'Can I track my progress?',
      answer: 'Absolutely! Quizlynx provides detailed analytics showing your performance, improvement over time, and areas where you excel or need more practice.'
    },
    {
      question: 'Is Quizlynx free to use?',
      answer: 'Yes, Quizlynx offers a free tier with access to hundreds of quizzes. We also have premium features for users who want unlimited access and advanced analytics.'
    }
  ];

  // Feature cards data
  features = [
    {
      icon: '🧠',
      title: 'Mind Bender Challenge',
      description: 'Stretch your cognitive abilities with our collection of brain-teasing puzzles, riddles, and logic-based quizzes.',
      gradient: 'from-purple-100 to-blue-100'
    },
    {
      icon: '⏰',
      title: 'Trivia Time Machine',
      description: 'Take a nostalgic trip through time with our trivia quizzes spanning various eras and topics.',
      gradient: 'from-purple-100 to-blue-100'
    },
    {
      icon: '🗺️',
      title: 'Explorer\'s Quest',
      description: 'Embark on a knowledge expedition with our Explorer\'s Quest quizzes covering geography, science, and culture.',
      gradient: 'from-purple-100 to-blue-100'
    }
  ];

  // Methods for interactivity
  tryQuizlynx() {
    this.router.navigate(['/signin'])
  }

  register() {
    this.router.navigate(['/register'])
  }

  exploreCategory(category: string) {
    console.log(`Explore ${category} clicked`);
    // Add navigation logic here
  }

  getStarRating(rating: number): string[] {
    return Array(rating).fill('★');
  }

  ngOnInit() {
    this.setupScrollAnimations();
    // Initialize any component setup
    setTimeout(() => {
      const heroElements = document.querySelectorAll('section:first-of-type [data-animate]');
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, index * 200);
      });
    }, 100);
  }

  ngAfterViewInit() {
    
    // Animate hero section immediately
  }

  setupScrollAnimations() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-animate');
          if (elementId && !this.animatedElements.has(elementId)) {
            this.animatedElements.add(elementId);
            this.animateElement(entry.target as HTMLElement);
          }
        }
      });
    }, options);

    // Observe all elements with data-animate attribute
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(el => this.observer.observe(el));
    }, 100);
  }

  private animateElement(element: HTMLElement) {
    element.classList.add('animate-in');
    
    // Add staggered animation for child elements
    const cards = element.querySelectorAll('.feature-card, .stat-card, .testimonial-card, .faq-item');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
