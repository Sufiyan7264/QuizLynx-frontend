import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface ExploreCategory {
  name: string;
  description: string;
  icon: string;
  tag: string;
}

interface TrendingQuiz {
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  rating: number;
}

@Component({
  selector: 'app-user-explore',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ButtonModule, FormsModule],
  templateUrl: './user-explore.html',
  styleUrl: './user-explore.scss',
})
export class UserExplore {
  searchQuery = '';

  categories: ExploreCategory[] = [
    {
      name: 'Java',
      description: 'Object‑oriented programming, OOP principles, collections, and more.',
      icon: 'pi pi-code',
      tag: 'Programming',
    },
    {
      name: 'Python',
      description: 'Data structures, algorithms, automation, and data science basics.',
      icon: 'pi pi-bolt',
      tag: 'Programming',
    },
    {
      name: 'History',
      description: 'Modern world, ancient civilizations, and key historical events.',
      icon: 'pi pi-globe',
      tag: 'Humanities',
    },
    {
      name: 'Math',
      description: 'Algebra, calculus, probability, and quantitative aptitude.',
      icon: 'pi pi-calculator',
      tag: 'STEM',
    },
  ];

  trendingQuizzes: TrendingQuiz[] = [
    {
      title: 'Java Basics: OOP & Collections',
      category: 'Java',
      difficulty: 'Medium',
      attempts: 1240,
      rating: 4.8,
    },
    {
      title: 'World War II Quick Check',
      category: 'History',
      difficulty: 'Easy',
      attempts: 980,
      rating: 4.6,
    },
    {
      title: 'Data Structures in Python',
      category: 'Python',
      difficulty: 'Hard',
      attempts: 720,
      rating: 4.9,
    },
    {
      title: 'Algebra & Functions Drill',
      category: 'Math',
      difficulty: 'Medium',
      attempts: 860,
      rating: 4.7,
    },
  ];

  get filteredTrendingQuizzes(): TrendingQuiz[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      return this.trendingQuizzes;
    }
    return this.trendingQuizzes.filter((quiz) =>
      (quiz.title + quiz.category).toLowerCase().includes(query)
    );
  }
}


