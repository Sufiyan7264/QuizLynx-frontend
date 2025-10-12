import { Component, inject, OnInit } from '@angular/core';
import { HalfCircle } from "../common/half-circle/half-circle";
import { FormDataService } from '../../core/service/form-data-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { otpConfig } from '../../core/interface/interfaces';
import { InputOtpModule } from 'primeng/inputotp';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-otp',
  imports: [HalfCircle,ReactiveFormsModule,InputOtpModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {
  private readonly spinner = inject(NgxSpinnerService);
  private readonly authService = inject(Auth);
  private readonly msgService = inject(MessageService);
  private readonly router = inject(Router);
  email: string = JSON.parse(localStorage.getItem('register') || '{}').email || '';
  username: string = JSON.parse(localStorage.getItem('register') || '{}').username || '';
  type: string = JSON.parse(localStorage.getItem('register') || '{}').type || '';
  private readonly fb = inject(FormBuilder);

  otpForm : FormGroup = this.fb.group({
    value:['',Validators.required]
  });

  onSubmit() {
    const otpValue = Object.values(this.otpForm.value).join('');
    let payload = {
      otp: otpValue,
      email:this.email
    }
    this.spinner.show();
    if(this.type === 'register'){
          
    this.authService.verifyOtp(payload).subscribe({
      next:(res:any)=>{
        this.msgService.add({severity:'success', summary:'Success', detail: res?.message ?? 'OTP Verification Successfull'});
        const user = { username: res.username, role: res?.role[0] ? res?.role[0]?.authority : res?.role  };
        this.authService.setLoggedIn(user);
        this.router.navigate(['/dashboard']);
        localStorage.removeItem('register');
        this.spinner.hide();
      },
      error:(error:any)=>{
        this.msgService.add({severity:'error', summary:'Error', detail: error?.error ?? error?.error?.message ?? 'OTP is incorrect'});
        this.spinner.hide();
      }
    })
    }else if(this.type === 'forgot-password'){
      this.authService.verifyOtp(payload).subscribe({
        next:(res:any)=>{ 
          localStorage.setItem('register',JSON.stringify({email:this.email,otp:otpValue,type:'forgot-password'}));
          this.msgService.add({severity:'success', summary:'Success', detail: res?.message ?? 'OTP Verification Successfull'});
          this.router.navigate(['/new-password']);
          this.spinner.hide();
        },
        error:(error:any)=>{ 
          this.msgService.add({severity:'error', summary:'Error', detail: error?.error ?? error?.error?.message ?? 'OTP is incorrect'});
          this.spinner.hide();
        }
      })
    }else{
      this.msgService.add({severity:'error', summary:'Error', detail: 'Invalid type'});
      this.spinner.hide();
    }
  }

  resendOtp(){
    let payload : otpConfig = {
      email: this.email,
      username:this.username
    }
    this.authService.resendOtp(payload).subscribe({
      next:(res:any)=>{
        this.msgService.add({severity:'success', summary:'Success', detail:  res?.message ?? "OTP Resent Successfully"});
      },
      error:(error:any)=>{
        this.msgService.add({severity:'error', summary:'Error', detail: error?.error ?? error?.error?.message ?? 'OTP is incorrect'});
      }
    })
  }
  isInvalid(controlName: string) {
    const control = this.otpForm.get(controlName);
    return control?.invalid && control.touched ;
}
}
