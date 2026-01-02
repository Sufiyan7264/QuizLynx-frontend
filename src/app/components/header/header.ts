import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from "@angular/router";
import { Auth } from '../../core/service/auth';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { Avatar } from "primeng/avatar";
import { Tag } from "primeng/tag";
import { UserInfo } from '../../core/interface/interfaces';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';import { Common } from '../../core/common/common';
import { MobileNavLink } from '../common/mobile-nav-link/mobile-nav-link';
import { AiGenerator } from "../ai-generator/ai-generator";

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule,TooltipModule, RouterModule, Avatar, MenuModule, BadgeModule, Tag, MobileNavLink, AiGenerator],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  showAiModal = false;

  // 2. Helper to open it
  openAiTool() {
    this.showAiModal = true;
  }
  onAiSuccess() {
    // If you are on a quiz page, you might want to refresh it.
    // Since the header is global, we usually just show a success message 
    // (which the component handles internally) and close the modal.
    this.showAiModal = false;
  }
  isScrolled = false;
  public readonly authService = inject(Auth)
  public readonly router = inject(Router)
  // private readonly msg = inject(MessageService)
  private readonly common = inject(Common);
  isLoggedIn$!: Observable<boolean>;
  user$!: Observable<UserInfo | null>;
  currentUser: any = 'user';
  darkMode = signal<boolean>(false);
  items: MenuItem[] | undefined;
  mobileMenuOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser = this.authService.getCachedUser();
    this.user$ = this.authService.user$;
    this.authService.user$.subscribe((u:any) => this.currentUser = u);   // subscribe in template via async pipe
    let localTheme = localStorage.getItem('theme');
    if (localTheme === 'dark') {
      this.darkMode.set(true);
      document.documentElement.classList.add('dark');
    } else {
      this.darkMode.set(false);
      document.documentElement.classList.remove('dark');
    }
    this.items = [
      {
        separator: true
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            routerLink: '/settings'
          },
          // {
          //   label: 'Messages',
          //   icon: 'pi pi-inbox',
          //   badge: '2'
          // },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            // shortcut: '⌘+Q',
            linkClass: '!text-red-500 dark:!text-red-400',
            command: () => this.logout()
          }
        ]
      },
      {
        separator: true
      }
    ];
  }
@HostListener('window:scroll')
onWindowScroll(): void {
  if(typeof window !== 'undefined') {
  this.isScrolled = window.scrollY > 10;
}
  }

logout(){
  this.authService.logout().subscribe({
    next: (res: any) => {
      // this.authService.setLoggedOut();
      this.router.navigate(['']);
      this.common.showMessage('success', 'Success', 'User Logout successfully');
    },
    error: (error: any) => {
      this.router.navigate(['']);
      this.authService.setLoggedOut();
    }
  })
}
getRoleColor(role: string): string {
  switch (role.toUpperCase()) {
    case 'STUDENT': return 'bg-blue-100 text-blue-800';
    case 'INSTRUCTOR': return 'bg-green-100 text-green-800';
    case 'ADMIN': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

getRoleIcon(role: string): string {
  switch (role.toUpperCase()) {
    case 'STUDENT': return 'pi pi-user';
    case 'INSTRUCTOR': return 'pi pi-users';
    case 'ADMIN': return 'pi pi-cog';
    default: return 'pi pi-user';
  }
}
toggleDarkMode(){
  this.darkMode.update(value => !value);
  if (this.darkMode()) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
toggleMobileMenu(){
  this.mobileMenuOpen.update(value => !value);
}
closeMobileMenu(){
  this.mobileMenuOpen.set(false);
}
}
