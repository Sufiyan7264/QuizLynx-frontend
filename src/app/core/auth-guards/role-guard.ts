import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // 1. Get expected roles (allow both single string or array of strings)
  const expectedRoles = route.data['role']; 
  
  // 2. Get current user
  const user = auth.getCachedUser(); 

  // 3. Check if user exists and has a matching role
  if (user && user.role) {
    // Scenario A: Route data is an array ['STUDENT', 'USER']
    if (Array.isArray(expectedRoles)) {
      if (expectedRoles.includes(user.role)) {
        return true;
      }
    } 
    // Scenario B: Route data is a single string 'INSTRUCTOR'
    else if (user.role === expectedRoles) {
      return true;
    }
  }

  // 4. Unauthorized: Redirect to home or specific error page
  // Optional: Redirect specific roles to their own dashboards to be helpful
  if (user?.role === 'INSTRUCTOR') router.navigate(['/dashboard']);
  else if (user?.role === 'STUDENT') router.navigate(['/student-dashboard']);
  else router.navigate(['/user-dashboard']); 
  
  return false;
};