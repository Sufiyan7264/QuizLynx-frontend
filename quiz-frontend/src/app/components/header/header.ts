import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 10;
    }
  }
}
