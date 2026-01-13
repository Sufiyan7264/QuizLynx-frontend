import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, UpdateProfileRequest, UpdatePasswordRequest } from '../../../core/service/user';
import { Instructor } from '../../../core/service/instructor';
import { Auth } from '../../../core/service/auth';
import { UserInfo } from '../../../core/interface/interfaces';
// import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
// import { MessageService } from 'primeng/api';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { Common } from '../../../core/common/common';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Dialog,
    // Toast
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  // providers: [MessageService]
})
export class Settings implements OnInit {
  private readonly userService = inject(UserService);
  private readonly instructorService = inject(Instructor);
  private readonly authService = inject(Auth);
  private readonly fb = inject(FormBuilder);
  private readonly common = inject(Common);
  // private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);

  currentUser?: UserInfo | null;
  isInstructor = false;
  instructorProfile: any = null;
  isEditMode = false;
  originalProfileData: any = null;

  // Profile Form
  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    bio: ['']
    // firstName: [''],
    // lastName: [''],
    // avatarUrl: [''],
  });

  // Password Form
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required,Validators.minLength(8)]]
  }, { validators: this.passwordMatchValidator });

  // Delete Account Dialog
  showDeleteDialog = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCachedUser();
    this.isInstructor = this.currentUser?.role === 'INSTRUCTOR';
    // this.isEditMode = false; // Start in view mode
    // this.loadProfile();
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

//   loadProfile(): void {
//     this.common.showSpinner();
    
//     if (this.isInstructor) {
//       this.instructorService.getInstructorInfo().subscribe({
//         next: (profile: any) => {
//           this.instructorProfile = profile;
//           const profileData = {
//             displayName: profile.displayName || (profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : '') || profile.username || '',
//             // firstName: profile.firstName || '',
//             // lastName: profile.lastName || '',
//             // avatarUrl: profile.avatarUrl || '',
//             bio: profile.bio || ''
//           };
//           this.originalProfileData = { ...profileData };
//           this.profileForm.patchValue(profileData);
//           this.setFormReadOnly();
//           this.common.hideSpinner();
//         },
//         error: (error) => {
//           console.error('Error loading instructor profile:', error);
//           this.common.showMessage('error', 'Error',error?.error?.message || 'Failed to load profile'
//           );
//           this.common.hideSpinner();
//         }
//       });
//     } else {
//       this.userService.getCurrentUserProfile().subscribe({
//         next: (profile: any) => {
//           const profileData = {
//             displayName: profile.displayName || profile.username || '',
//             // firstName: profile.firstName || '',
//             // lastName: profile.lastName || '',
//             // avatarUrl: profile.avatarUrl || ''
//             bio: profile.bio || ''
//           };
//           this.originalProfileData = { ...profileData };
//           this.profileForm.patchValue(profileData);
//           this.setFormReadOnly();
//           this.common.hideSpinner();
//         },
//         error: (error) => {
//           console.error('Error loading profile:', error);
//           this.common.showMessage(
// 'error','Error', error?.error?.message || 'Failed to load profile'
//           );
//           this.common.hideSpinner();
//         }
//       });
//     }
//   }

  setFormReadOnly(): void {
    // Form is always disabled - we'll use it just to store values
    // When in edit mode, we'll show inputs, when not, we'll show read-only display
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
      // firstName: formValue.firstName || undefined,
      // lastName: formValue.lastName || undefined,
      // avatarUrl: formValue.avatarUrl || undefined,
      bio: this.isInstructor ? (formValue.bio || undefined) : undefined
    };

    this.common.showSpinner();

    if (this.isInstructor) {
      this.instructorService.updateInstructorProfile(profileData).subscribe({
        next: () => {
          this.common.showMessage(
'success','Success', 'Profile updated successfully'
          );
          this.isEditMode = false;
          this.profileForm.disable();
          // this.loadProfile();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage(
'error','Error', error?.error?.message || 'Failed to update profile'
          );
          this.common.hideSpinner();
        }
      });
    } else {
      this.userService.updateProfile(profileData).subscribe({
        next: () => {
          this.common.showMessage(
'success','Success', 'Profile updated successfully'
          );
          this.isEditMode = false;
          this.profileForm.disable();
          // this.loadProfile();
          this.common.hideSpinner();
        },
        error: (error) => {
          this.common.showMessage(
'error','Error', error?.error?.message || 'Failed to update profile'
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
      next: (res:any) => {
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

