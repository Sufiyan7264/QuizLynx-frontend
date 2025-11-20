import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from "@angular/router";
import { Auth } from '../../core/service/auth';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Avatar } from "primeng/avatar";
import { Tag } from "primeng/tag";
import { UserInfo } from '../../core/interface/interfaces';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, RouterModule, Avatar, Tag],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isScrolled = false;
  private readonly authService= inject(Auth)
  private readonly router= inject(Router)
  private readonly msg= inject(MessageService)
  isLoggedIn$!: Observable<boolean>;
  user$!: Observable<UserInfo | null>;
  currentUser: any = 'user';
  darkMode = signal<boolean>(false);
  
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser = this.authService.getCachedUser();
    this.user$ = this.authService.user$; 
    this.authService.user$.subscribe(u => this.currentUser = u);   // subscribe in template via async pipe
    let localTheme = localStorage.getItem('theme');
    if (localTheme === 'dark') {
      this.darkMode.set(true);
      document.documentElement.classList.add('dark');
    } else {
      this.darkMode.set(false);
      document.documentElement.classList.remove('dark');
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 10;
    }
  }

  logout(){
    this.authService.logout().subscribe({
      next:(res:any)=>{
        this.authService.setLoggedOut();
        this.router.navigate(['']);
        this.msg.add({severity:'success', summary:'Success', detail: 'User Logout successfully'});
      },
      error:(error:any)=>{
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
    if(this.darkMode()){
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme','dark');
    }else{
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme','light');
    }
  }
}
