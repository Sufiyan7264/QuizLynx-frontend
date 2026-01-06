import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Auth } from './core/service/auth';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastModule,NgxSpinnerModule,ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('QuizLynx');
  private readonly auth = inject(Auth);

  ngOnInit(): void {
    if (!this.auth.getCachedUser()) {
      this.auth.fetchProfile().subscribe({
        next: (user) => console.log('Restored session via Cookie', user),
        error: () => console.log('No active session')
      });
    }
  }
}
