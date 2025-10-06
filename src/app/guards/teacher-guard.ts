import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

export const teacherGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const user = auth.currentUser;

  // Replace with your teacher email
  const teacherEmail = environment.teacherEmail;

  if (user && user.email === teacherEmail) {
    return true;
  }

  // If not teacher, redirect to grades list
  router.navigate(['/grades']);
  return false;
};
