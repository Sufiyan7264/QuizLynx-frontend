import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user';
import { ExploreCategory, TrendingQuiz } from '../../core/interface/interfaces';
import { Common } from '../../core/common/common';
import { DecimalPipe } from '@angular/common';
import { Dialog } from 'primeng/dialog';

// Interfaces match your DTOs


@Component({
  selector: 'app-user-explore',
  standalone: true,
  imports: [ButtonModule, FormsModule,DecimalPipe,Dialog],
  templateUrl: './user-explore.html',
  styleUrl: './user-explore.scss',
})
export class UserExplore implements OnInit {
  // private http = inject(HttpClient);
  private router = inject(Router);
  private common = inject(Common);
  private user = inject(UserService)

  searchQuery = '';
  categories: ExploreCategory[] = [];
  trendingQuizzes: TrendingQuiz[] = [];
  showDifficultyModal = false;
  selectedCategoryForQuiz = '';

  ngOnInit() {
    this.fetchCategories();
    this.fetchTrending();
  }
  openDifficultySelection(categoryName: string) {
    this.selectedCategoryForQuiz = categoryName;
    this.showDifficultyModal = true;
  }

  fetchCategories() {
    this.user.getByCategory<ExploreCategory[]>()
      .subscribe({
        next: (data:any) => this.categories = data,
        error: (err) => this.common.showMessage('error',"Error",err.error.message || 'Error loading categories')
      });
  }

  fetchTrending() {
    this.user.getByTrending<TrendingQuiz[]>()
      .subscribe({
        next: (data:any) => this.trendingQuizzes = data,
        error: (err) => this.common.showMessage('error',"Error",err.error.message || 'Error loading trending quizzes')
      });
  }

  // startQuiz(quizId: number) {
  //   this.router.navigate(['/quiz/attempt', quizId]);
  // }

  get filteredTrendingQuizzes(): TrendingQuiz[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      return this.trendingQuizzes;
    }
    return this.trendingQuizzes.filter((quiz) =>
      (quiz.title + quiz.category).toLowerCase().includes(query)
    );
  }

  // Inside UserExplore Component

  generateQuiz(difficulty: string, category: string) {
    this.common.showSpinner();
    this.showDifficultyModal = false;
    const payload = {
      category: category, // Use the stored category
      difficulty: difficulty.toLowerCase()    // Use the selected difficulty
    };

    this.user.getByGenerateQuiz<any>(payload).subscribe({
      next: (res:any) => {
        this.common.hideSpinner();
        // Navigate immediately to the newly generated quiz
        this.router.navigate(['/quiz/attempt', res.quizId]);
      },
      error: (err) => {
        this.common.hideSpinner();
        this.common.showMessage('error', 'Error', err.message || 'Failed to generate quiz');
      }
    });
  }
  isSearchEmpty = false;

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.fetchTrending(); 
      this.isSearchEmpty = false; // Reset
      return;
    }

    this.user.searchQuery<TrendingQuiz[]>(this.searchQuery)
      .subscribe({
        next: (data:any) => {
          this.trendingQuizzes = data;
          
          // Check if results are empty
          this.isSearchEmpty = data.length === 0;
        },
        error: (err:any) => console.error(err)
      });
  }

  // Wrapper to generate quiz using the Search Query as the category
  generateFromSearch() {
    // This calls your existing generate function
    // The backend getCategoryId logic will map "Biology" -> ID 17
    this.generateQuiz('',this.searchQuery); 
  }
}