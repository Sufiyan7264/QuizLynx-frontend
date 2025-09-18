import { Component, inject } from '@angular/core';
import { HalfCircle } from '../common/half-circle/half-circle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-in',
  imports: [HalfCircle, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  providers:[Auth,MessageService]
})
export class SignIn {
  private readonly fb = inject(FormBuilder);
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
    this.authService.signin(this.signInForm.value).subscribe({
      next:(res:any)=>{

      },
      error:(error:Error)=>{
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });

      }
    })
  }
}
