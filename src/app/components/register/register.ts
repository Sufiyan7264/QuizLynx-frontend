import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HalfCircle } from "../common/half-circle/half-circle";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Auth } from '../../core/service/auth';
import { Router } from '@angular/router';
import { FormDataService } from '../../core/service/form-data-service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-register',
  imports: [CommonModule, HalfCircle, ɵInternalFormsSharedModule,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private readonly spinner = inject(NgxSpinnerService)
  private readonly fb = inject(FormBuilder);
  private readonly authS = inject(Auth);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  roles: Array<{ key: 'student' | 'instructor' | 'user'; label: string }> = [
    { key: 'student', label: 'Student' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'user', label: 'User' }
  ];

  selectedRole: 'STUDENT' | 'INSTRUCTOR' | 'USER' = 'STUDENT';
  passwordError: boolean=false;
  registerForm:FormGroup = this.fb.group({
    username: ['',[Validators.required,Validators.pattern(/^\S+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    role: [this.selectedRole,[Validators.required]]
  });

  onSubmit() {
    this.passwordError = false;
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log(this.registerForm.value);
    if(this.registerForm.value.password !== this.registerForm.value.confirmPassword){
      this.passwordError = true;
      return;
    }
    delete this.registerForm.value.confirmPassword;
    this.spinner.show();
    this.authS.register(this.registerForm.value).subscribe({
      next: (res:any) => {
        localStorage.setItem('register',JSON.stringify({email:this.registerForm.value.email,username:this.registerForm.value.username,type:'register'}));
        this.spinner.hide();
        this.router.navigate(['/otp']);
      } ,
      error: (err:any) => {
        this.messageService.add({severity:'error', summary:'Error', detail: err?.error?.message ?? 'Registration failed'});}
    })
  }


  setRole(role: 'STUDENT' | 'INSTRUCTOR' | 'USER') {
    this.selectedRole = role;
    this.registerForm.get('role')?.setValue(role);
  }
}
