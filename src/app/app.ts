import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastModule,NgxSpinnerModule,ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('quiz-frontend');
}
