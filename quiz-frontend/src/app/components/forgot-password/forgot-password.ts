import { Component, inject } from '@angular/core';
import { HalfCircle } from "../common/half-circle/half-circle";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [HalfCircle,RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  private readonly router = inject(Router);
  sendCode(e:Event){
    e.preventDefault();
    this.router.navigate(['/otp']);
  }

}
