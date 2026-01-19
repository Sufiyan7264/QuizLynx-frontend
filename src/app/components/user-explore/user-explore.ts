import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user';
import { ExploreCategory, TrendingQuiz } from '../../core/interface/interfaces';
import { Common } from '../../core/common/common';
import { DecimalPipe } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-user-explore',
  standalone: true,
  imports: [ButtonModule, FormsModule, DecimalPipe, Dialog, PaginatorModule],
  templateUrl: './user-explore.html',
  styleUrl: './user-explore.scss',
})
export class UserExplore implements OnInit {
  private router = inject(Router);
  private common = inject(Common);
  private user = inject(UserService);
  payload: any = {
    page: 0,
    size: 10
  }

  searchQuery = '';
  categories: ExploreCategory[] = [];
  trendingQuizzes: TrendingQuiz[] = [];
  showDifficultyModal = false;
  selectedCategoryForQuiz = '';
  first: number = 0;
  totalRecords = signal<any>(10);
  rows: number = 10;



  ngOnInit() {
    this.fetchCategories();
    this.fetchTrending(this.payload);
  }
  openDifficultySelection(categoryName: string) {
    this.selectedCategoryForQuiz = categoryName;
    this.showDifficultyModal = true;
  }

  gotoselectionpage(name: any) {
    this.router.navigate(['explore/category', name])

  }
  fetchCategories() {
    this.common.showSpinner();
    this.user.getByCategory<ExploreCategory[]>()
      .subscribe({
        next: (data: any) => { this.categories = data; this.common.hideSpinner() },
        error: (err) => { this.common.showMessage('error', "Error", err.error.message || 'Error loading categories'); this.common.hideSpinner() }
      });
  }

  fetchTrending(payload: any) {
    this.user.getByTrending<TrendingQuiz[]>(payload)
      .subscribe({
        next: (res: any) => { this.trendingQuizzes = res.content; this.totalRecords.set(res.totalElements) },
        error: (err) => this.common.showMessage('error', "Error", err.error.message || 'Error loading trending quizzes')
      });
  }

  get filteredTrendingQuizzes(): TrendingQuiz[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      return this.trendingQuizzes;
    }
    return this.trendingQuizzes.filter((quiz) =>
      (quiz.title + quiz.category).toLowerCase().includes(query)
    );
  }

  generateQuiz(difficulty: string, category: string) {
    this.common.showSpinner();
    this.showDifficultyModal = false;
    const payload = {
      category: category, // Use the stored category
      difficulty: difficulty.toLowerCase()    // Use the selected difficulty
    };

    this.user.getByGenerateQuiz<any>(payload).subscribe({
      next: (res: any) => {
        this.common.hideSpinner();
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
      this.fetchTrending(this.payload);
      this.isSearchEmpty = false; // Reset
      return;
    }

    this.user.searchQuery<TrendingQuiz[]>(this.searchQuery)
      .subscribe({
        next: (data: any) => {
          this.trendingQuizzes = data;
          this.isSearchEmpty = data.length === 0;
        },
        error: (err: any) => console.error(err)
      });
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.payload = {
      page: event.page,
      size: this.rows,
    }
    this.fetchTrending(this.payload);
  }
}