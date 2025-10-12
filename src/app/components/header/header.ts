import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from "@angular/router";
import { Auth } from '../../core/service/auth';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isScrolled = false;
  private readonly authService= inject(Auth)
  private readonly router= inject(Router)
  private readonly msg= inject(MessageService)
  isLoggedIn$!: Observable<boolean>;
  
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
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
      }
    })

  }
  cick(){
    this.authService.click().subscribe({
      next:(res:any)=>{
        // this.authService.setLoggedOut();
        // this.router.navigate(['']);
        this.msg.add({severity:'success', summary:'Success', detail: 'User Logout successfully'});
      }
    })

  }
}
