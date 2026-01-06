import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss'
})
export class Leaderboard {
  topThree = [
    { name: 'Ava Martin', score: 9820, rank: 1, country: 'US' },
    { name: 'Liam Patel', score: 9410, rank: 2, country: 'IN' },
    { name: 'Sofia Chen', score: 9105, rank: 3, country: 'SG' },
  ];

  players = [
    { name: 'Diego Ramirez', score: 8890, rank: 4, country: 'MX' },
    { name: 'Emma Brown', score: 8740, rank: 5, country: 'UK' },
    { name: 'Noah Smith', score: 8620, rank: 6, country: 'CA' },
    { name: 'Mia Rossi', score: 8515, rank: 7, country: 'IT' },
    { name: 'Lucas Müller', score: 8440, rank: 8, country: 'DE' },
    { name: 'Chloe Dubois', score: 8325, rank: 9, country: 'FR' },
    { name: 'Yuto Tanaka', score: 8210, rank: 10, country: 'JP' },
  ];
}
