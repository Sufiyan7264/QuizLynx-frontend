import { Component, inject } from '@angular/core';
import { HalfCircle } from '../common/half-circle/half-circle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-password',
  imports: [HalfCircle, ReactiveFormsModule],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss',
})
export class NewPassword {
  private readonly fb = inject(FormBuilder);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(Auth);

  newPasswordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  updatePassword() {
    console.log(this.newPasswordForm.value);
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }
    
    this.spinner.show();
    const passwordData = {
      password: this.newPasswordForm.value.password,
      email: this.getEmailFromStorage(),
      otp: this.getOtpFromStorage()
    };
    
    this.authService.updatePassword(passwordData).subscribe({
      next: (res: any) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Password updated successfully' 
        });
        localStorage.removeItem('register');
        this.router.navigate(['/signin']);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error?.error?.message || 'Something went wrong' 
        });
        this.spinner.hide();
      }
    });
  }

  private getEmailFromStorage(): string {
    const registerData = localStorage.getItem('register');
    if (registerData) {
      const parsed = JSON.parse(registerData);
      return parsed.email;
    }
    return '';
  }
  private getOtpFromStorage(): string {
    const registerData = localStorage.getItem('register');
    if (registerData) {
      const parsed = JSON.parse(registerData);
      return parsed.otp;
    }
    return '';
  }
}
