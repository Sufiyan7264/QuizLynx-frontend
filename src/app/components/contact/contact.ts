import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/service/user';
import { ButtonModule } from 'primeng/button';
import { Common } from '../../core/common/common';

@Component({
    selector: 'app-contact',
    imports: [CommonModule, RouterLink, ReactiveFormsModule, ButtonModule],
    templateUrl: './contact.html',
    styleUrl: './contact.scss'
})
export class Contact {
    private readonly user = inject(UserService);
    private readonly fb = inject(FormBuilder);
    private common = inject(Common);
    contactForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', Validators.required],
        message: ['', Validators.required]
    });

    isSubmitting = false;
    submitted = false;

    contactInfo = [
        {
            icon: 'pi pi-envelope',
            label: 'Email',
            value: 'quizlynxapp@gmail.com',
            link: 'mailto:quizlynxapp@gmail.com'
        },
        {
            icon: 'pi pi-linkedin',
            label: 'LinkedIn',
            value: 'quizlynx',
            link: 'https://linkedin.com/in/mohd-sufiyan-jamal'
        },
        {
            icon: 'pi pi-github',
            label: 'GitHub',
            value: 'quizlynx',
            link: 'https://github.com/Sufiyan7264'
        }
    ];
    submitForm() {
        if (this.contactForm.invalid) {
            return;
        }
        this.isSubmitting = true;
        console.log(this.contactForm.value)
        this.user.contactUs(this.contactForm.value).subscribe({
            next: (res: any) => {
                console.log(res)
                this.isSubmitting = false;
                this.submitted = true;
                this.contactForm.reset();
                this.common.showMessage('success', 'Success', res?.message || 'Message sent successfully.');
            },
            error: (error: any) => {
                this.isSubmitting = false;
                this.common.showMessage('error', 'Error', error?.error?.message || 'Failed to send message. Please try again.');
            }
        });
    }
    isInvalid(controlName: string) {
        return !!this.contactForm.get(controlName)?.invalid && this.contactForm.get(controlName)?.touched;
    }
}
