import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { onAuthStateChanged } from 'firebase/auth';

export const teacherGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const user = auth.currentUser;
  console.log('TeacherGuard checking user:', user);

  // Replace with your teacher email
  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      console.log('TeacherGuard onAuthStateChanged:', user);

      const teacherEmail = environment.teacherEmail;
      if (user && user.email === teacherEmail) {
        resolve(true); // allow access
      } else {
        router.navigate(['/grades']); // redirect if not teacher
        resolve(false);
      }
    });
  });
};
