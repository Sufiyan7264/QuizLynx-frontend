import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { QuizService } from '../../core/service/quiz';

@Component({
  selector: 'app-user-category-list',
  imports: [ButtonModule],
  templateUrl: './user-category-list.html',
  styleUrl:'./user-category-list.scss'
})
export class UserCategoryList implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private quiz = inject(QuizService);

  subject: string = '';
  quizzes: any[] = [];
  isLoading = true;

  ngOnInit() {
    // Get subject from URL (e.g., /explore/category/Java)
    this.subject = this.route.snapshot.params['subject'];
    this.fetchQuizzes();
  }

  fetchQuizzes() {
    this.isLoading = true;
    this.quiz.getQuizBycategory(this.subject)
      .subscribe({
        next: (data) => {
          this.quizzes = data;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  startQuiz(quizId: number) {
    this.router.navigate(['/quiz/attempt', quizId]);
  }

  // Reuse your AI generation logic here for the fallback button
  generateNew() {
     // ... call your user.createAiTopics() ...
  }
}