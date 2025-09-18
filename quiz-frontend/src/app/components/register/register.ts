import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HalfCircle } from "../common/half-circle/half-circle";
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [CommonModule, HalfCircle, ɵInternalFormsSharedModule,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private readonly fb = inject(FormBuilder);
  roles: Array<{ key: 'student' | 'instructor' | 'user'; label: string }> = [
    { key: 'student', label: 'Student' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'user', label: 'User' }
  ];

  selectedRole: 'STUDENT' | 'INSTRUCTOR' | 'USER' = 'STUDENT';
  passwordError: boolean=false;
  registerForm = this.fb.group({
    fullName: ['',Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    role: [this.selectedRole]
  });

  onSubmit() {
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }
    if(this.registerForm.value.password !== this.registerForm.value.confirmPassword){
      this.passwordError = true;
      return;
    }
  }


  setRole(role: 'STUDENT' | 'INSTRUCTOR' | 'USER') {
    this.selectedRole = role;
  }
}
