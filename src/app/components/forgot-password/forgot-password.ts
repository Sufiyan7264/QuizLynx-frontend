import { Component, inject } from '@angular/core';
import { HalfCircle } from "../common/half-circle/half-circle";
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { Common } from '../../core/common/common';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  imports: [HalfCircle,RouterModule,ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  // private readonly messageService = inject(MessageService);
  private common = inject(Common);
  private readonly authService = inject(Auth);
  forgotPasswordForm:FormGroup = this.fb.group({
    email:['',[Validators.required,Validators.email]],
  });
  sendCode(){
    if(this.forgotPasswordForm.invalid){
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this.common.showSpinner();;
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next:(res:any)=>{
        localStorage.setItem('register',JSON.stringify({email:this.forgotPasswordForm.value.email,type:'forgot-password'}));
        this.router.navigate(['/new-password']);
        this.common.hideSpinner();;
      },
      error:(error:any)=>{
        this.common.showMessage('error','Error', error?.error ?? error?.error?.message ?? 'OTP is incorrect');
        this.common.hideSpinner();;
      }
    })
  }

}
