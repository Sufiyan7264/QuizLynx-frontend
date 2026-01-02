import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-nav-link',
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-nav-link.html',
  styleUrl: './mobile-nav-link.scss'
})
export class MobileNavLink {
  @Input() routerLink!: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() isActive: boolean = false;
  @Output() linkClick = new EventEmitter<void>();

  onClick(): void {
    this.linkClick.emit();
  }
}

