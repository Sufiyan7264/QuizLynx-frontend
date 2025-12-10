import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, UpdateProfileRequest, UpdatePasswordRequest } from '../../../core/service/user';
import { Instructor } from '../../../core/service/instructor';
import { Auth } from '../../../core/service/auth';
import { UserInfo } from '../../../core/interface/interfaces';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Dialog,
    Toast
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  providers: [MessageService]
})
export class Settings implements OnInit {
  private readonly userService = inject(UserService);
  private readonly instructorService = inject(Instructor);
  private readonly authService = inject(Auth);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);

  currentUser?: UserInfo | null;
  isInstructor = false;
  instructorProfile: any = null;

  // Profile Form
  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    firstName: [''],
    lastName: [''],
    avatarUrl: [''],
    bio: ['']
  });

  // Password Form
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Delete Account Dialog
  showDeleteDialog = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCachedUser();
    this.isInstructor = this.currentUser?.role === 'INSTRUCTOR';
    
    this.loadProfile();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  loadProfile(): void {
    this.spinner.show();
    
    if (this.isInstructor) {
      this.instructorService.getInstructorInfo().subscribe({
        next: (profile: any) => {
          this.instructorProfile = profile;
          this.profileForm.patchValue({
            displayName: profile.displayName || profile.firstName + ' ' + profile.lastName || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            avatarUrl: profile.avatarUrl || '',
            bio: profile.bio || ''
          });
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error loading instructor profile:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to load profile'
          });
          this.spinner.hide();
        }
      });
    } else {
      this.userService.getCurrentUserProfile().subscribe({
        next: (profile: any) => {
          this.profileForm.patchValue({
            displayName: profile.displayName || profile.username || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            avatarUrl: profile.avatarUrl || ''
          });
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to load profile'
          });
          this.spinner.hide();
        }
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.value;
    const profileData: UpdateProfileRequest = {
      displayName: formValue.displayName,
      firstName: formValue.firstName || undefined,
      lastName: formValue.lastName || undefined,
      avatarUrl: formValue.avatarUrl || undefined,
      bio: this.isInstructor ? (formValue.bio || undefined) : undefined
    };

    this.spinner.show();

    if (this.isInstructor) {
      this.instructorService.updateInstructorProfile(profileData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully'
          });
          this.loadProfile();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to update profile'
          });
          this.spinner.hide();
        }
      });
    } else {
      this.userService.updateProfile(profileData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully'
          });
          this.loadProfile();
          this.spinner.hide();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to update profile'
          });
          this.spinner.hide();
        }
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const formValue = this.passwordForm.value;
    const passwordData: UpdatePasswordRequest = {
      currentPassword: formValue.currentPassword,
      newPassword: formValue.newPassword
    };

    this.spinner.show();
    this.authService.updatePassword(passwordData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password updated successfully'
        });
        this.passwordForm.reset();
        this.spinner.hide();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to update password. Please check your current password.'
        });
        this.spinner.hide();
      }
    });
  }

  openDeleteDialog(): void {
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
  }

  deleteAccount(): void {
    this.spinner.show();
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account deleted successfully'
        });
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/signin']);
            this.spinner.hide();
          },
          error: () => {
            this.router.navigate(['/signin']);
            this.spinner.hide();
          }
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to delete account'
        });
        this.closeDeleteDialog();
        this.spinner.hide();
      }
    });
  }
}

