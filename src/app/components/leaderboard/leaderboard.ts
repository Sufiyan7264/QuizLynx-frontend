import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../core/service/user';
import { Common } from '../../core/common/common';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  imports: [ButtonModule, DecimalPipe],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss'
})
export class Leaderboard implements OnInit {
  topThree = signal<any>([]);
  private readonly user = inject(UserService);
  private readonly common = inject(Common);
  players = signal<any>([]);
  public readonly router = inject(Router);
  ngOnInit(): void {
    this.getLeaderboardData();
  }
  getLeaderboardData() {
    this.user.getLeaderboard().subscribe({
      next: (res: any) => {
        console.log(res);
        this.topThree.set(res.slice(0, 3))
        this.players.set(res.slice(2));
      },
      error: (error: any) => {
        this.common.showMessage("error", 'Error', error.error.message)
      }
    })
  }
}
