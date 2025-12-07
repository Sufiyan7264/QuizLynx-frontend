import { Component, inject } from '@angular/core';
import { HalfCircle } from '../common/half-circle/half-circle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-in',
  imports: [HalfCircle, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  private readonly fb = inject(FormBuilder);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly messageService=inject(MessageService)
  private readonly authService = inject(Auth);

  signInForm:FormGroup=this.fb.group({
    username:['',[Validators.required]],
    password:['',[Validators.required]]
  });

  signIn() {
    console.log(this.signInForm.value);
    if(this.signInForm.invalid){
      this.signInForm.markAllAsTouched();
      return;
    }
    this.spinner.show();
    this.authService.signin(this.signInForm.value).subscribe({
      next:(res:any)=>{
        const user = { username: res.username, role: res?.role[0] ? res?.role[0]?.authority : res?.role  };
        this.authService.setLoggedIn(user);
        if(user.role == 'ADMIN' || user.role == 'INSTRUCTOR')
          this.router.navigate(['/dashboard']);
        else
          this.router.navigate(['/user-dashboard']);
        this.spinner.hide();
      },
      error:(error:any)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.status ==401 ? "Username or password is incorrect" :   error?.error?.message ?? 'Something went wrong' });
        if(error?.error?.message =='User is not verified. Please verify your account using the OTP sent to your email.'){
          this.router.navigate(['/otp']);
        }
        this.spinner.hide();
      }
    })
  }
}
