import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, UpdateProfileRequest, UpdatePasswordRequest } from '../../../core/service/user';
import { Instructor } from '../../../core/service/instructor';
import { Auth } from '../../../core/service/auth';
import { UserInfo } from '../../../core/interface/interfaces';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { Common } from '../../../core/common/common';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    InputText,
    Dialog,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private readonly userService = inject(UserService);
  private readonly instructorService = inject(Instructor);
  private readonly authService = inject(Auth);
  private readonly fb = inject(FormBuilder);
  private readonly common = inject(Common);
  private readonly router = inject(Router);

  currentUser?: UserInfo | null;
  isInstructor = false;
  instructorProfile: any = null;
  isEditMode = false;
  originalProfileData: any = null;
  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    bio: ['']
  });
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, { validators: this.passwordMatchValidator });
  showDeleteDialog = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCachedUser();
    this.isInstructor = this.currentUser?.role === 'INSTRUCTOR';
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

  setFormReadOnly(): void {
    this.profileForm.disable();
  }

  enableEditMode(): void {
    this.isEditMode = true;
    this.profileForm.enable(); // Enable form when in edit mode
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (this.originalProfileData) {
      this.profileForm.patchValue(this.originalProfileData);
    }
    this.profileForm.disable(); // Disable form when canceling
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.value;
    const profileData: UpdateProfileRequest = {
      displayName: formValue.displayName,
      bio: this.isInstructor ? (formValue.bio || undefined) : undefined
    };

    this.common.showSpinner();

    if (this.isInstructor) {
      this.instructorService.updateInstructorProfile(profileData).subscribe({
        next: () => {
          this.common.showMessage(
            'success', 'Success', 'Profile updated successfully'
          );
          this.isEditMode = false;
          this.profileForm.disable();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage(
            'error', 'Error', error?.error?.message || 'Failed to update profile'
          );
          this.common.hideSpinner();
        }
      });
    } else {
      this.userService.updateProfile(profileData).subscribe({
        next: () => {
          this.common.showMessage(
            'success', 'Success', 'Profile updated successfully'
          );
          this.isEditMode = false;
          this.profileForm.disable();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage(
            'error', 'Error', error?.error?.message || 'Failed to update profile'
          );
          this.common.hideSpinner();
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
      oldPassword: formValue.currentPassword,
      newPassword: formValue.newPassword
    };

    this.common.showSpinner();
    this.authService.updatePassword(passwordData).subscribe({
      next: () => {
        this.common.showMessage(
          'success',
          'Success',
          'Password updated successfully'
        );
        this.passwordForm.reset();
        this.common.hideSpinner();
      },
      error: (error) => {
        this.common.showMessage(
          'error',
          'Error',
          error?.error?.message || 'Failed to update password. Please check your current password.'
        );
        this.common.hideSpinner();
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
    this.common.showSpinner();
    this.userService.deleteAccount().subscribe({
      next: (res: any) => {
        this.authService.setLoggedOut();
        this.common.showMessage(
          'success',
          'Success',
          res.message
        );
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/signin']);
            this.common.hideSpinner();
          },
          error: () => {
            this.router.navigate(['/signin']);
            this.common.hideSpinner();
          }
        });
      },
      error: (error) => {
        this.common.showMessage(
          'error',
          'Error',
          error?.error?.message || 'Failed to delete account'
        );
        this.closeDeleteDialog();
        this.common.hideSpinner();
      }
    });
  }
}

