import { Component, inject, OnInit } from '@angular/core';
import { HalfCircle } from "../common/half-circle/half-circle";
import { FormDataService } from '../../core/service/form-data-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  imports: [HalfCircle,ReactiveFormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {
  private readonly formService = inject(FormDataService);
  email: string = this.formService.getFormData().email || '';
  private readonly fb = inject(FormBuilder);

  otpForm : FormGroup = this.fb.group({
    digit1: [''],
    digit2: [''],
    digit3: [''],
    digit4: [''],
    digit5: [''],
    digit6: ['']
  });

  onSubmit() {
    const otpValue = this.otpForm.value;
    console.log('OTP Submitted:', otpValue);
  }

}
