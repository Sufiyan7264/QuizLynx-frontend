import { Component, inject, OnInit } from '@angular/core';
import { HalfCircle } from "../common/half-circle/half-circle";
import { FormDataService } from '../../core/service/form-data-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { Router } from '@angular/router';
import { otpConfig } from '../../core/interface/interfaces';
import { InputOtpModule } from 'primeng/inputotp';
import { Common } from '../../core/common/common';

@Component({
  selector: 'app-otp',
  imports: [HalfCircle, ReactiveFormsModule, InputOtpModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {
  private readonly authService = inject(Auth);
  private common = inject(Common);
  private readonly router = inject(Router);
  email: string = JSON.parse(localStorage.getItem('register') || '{}').email || '';
  username: string = JSON.parse(localStorage.getItem('register') || '{}').username || '';
  type: string = JSON.parse(localStorage.getItem('register') || '{}').type || '';
  private readonly fb = inject(FormBuilder);

  otpForm: FormGroup = this.fb.group({
    value: ['', Validators.required]
  });

  onSubmit() {
    const otpValue = Object.values(this.otpForm.value).join('');
    let payload = {
      otp: otpValue.trim(),
      email: this.email
    }
    this.common.showSpinner();
    if (this.type === 'register') {

      this.authService.verifyOtp(payload).subscribe({
        next: (res: any) => {
          this.common.showMessage('success', 'Success', res?.message ?? 'OTP Verification Successfull');
          const user = { username: res.username, role: res?.role ?? res?.role[0]?.authority };
          this.authService.setLoggedIn(user);
          if (user.role == 'ADMIN' || user.role == 'INSTRUCTOR')
            this.router.navigate(['/dashboard']);
          else if (user.role == 'STUDENT')
            this.router.navigate(['/student-dashboard']);
          else
            this.router.navigate(['/user-dashboard']);
          localStorage.removeItem('register');
          this.common.hideSpinner();
        },
        error: (error: any) => {
          this.common.showMessage('error', 'Error', error?.message ?? error?.error?.message ?? 'OTP is incorrect');
          this.common.hideSpinner();
        }
      })
    } else if (this.type === 'forgot-password') {
      this.authService.verifyOtp(payload).subscribe({
        next: (res: any) => {
          localStorage.setItem('register', JSON.stringify({ email: this.email, otp: otpValue, type: 'forgot-password' }));
          this.common.showMessage('success', 'Success', res?.message ?? 'OTP Verification Successfull');
          this.router.navigate(['/new-password']);
          this.common.hideSpinner();
        },
        error: (error: any) => {
          this.common.showMessage('error', 'Error', error?.error ?? error?.error?.message ?? 'OTP is incorrect');
          this.common.hideSpinner();
        }
      })
    } else {
      this.common.showMessage('error', 'Error', 'Invalid type');
      this.common.hideSpinner();
    }
  }

  resendOtp() {
    let payload: otpConfig = {
      email: this.email,
      username: this.username
    }
    this.common.showSpinner();
    this.authService.resendOtp(payload).subscribe({
      next: (res: any) => {
        this.common.showMessage('success', 'Success', res?.message ?? "OTP Resent Successfully");
        this.common.hideSpinner();
      },
      error: (error: any) => {
        this.common.showMessage('error', 'Error', error?.error ?? error?.error?.message ?? 'OTP is incorrect');
      }
    })
  }
  isInvalid(controlName: string) {
    const control = this.otpForm.get(controlName);
    return control?.invalid && control.touched;
  }
}
