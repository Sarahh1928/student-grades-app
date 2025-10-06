import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  // ✅ Signup new user — handle both student and teacher
  async signup(email: string, password: string, fullName: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    // ✅ If teacher’s email — add to "teachers" collection
    if (email === environment.teacherEmail) {
      const teachersRef = collection(this.firestore, 'teachers');
      await setDoc(doc(teachersRef, user.uid), {
        name: fullName,
        email,
        role: 'teacher',
        createdAt: new Date()
      });

      alert('Teacher account created successfully!');
      this.router.navigate(['/dashboard']); // redirect to teacher dashboard

    } else {
      // ✅ Otherwise, add to "students" collection
      const studentsRef = collection(this.firestore, 'students');
      await setDoc(doc(studentsRef, user.uid), {
        name: fullName,
        email,
        role: 'student',
        createdAt: new Date()
      });

      this.router.navigate(['/grades']); // redirect to student grades view
    }

    return userCredential;
  }

  // ✅ Login user — teacher vs student
  async login(email: string, password: string): Promise<UserCredential | void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      if (email === environment.teacherEmail) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/grades']);
      }

      return userCredential;

    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else if (error.code === 'auth/user-not-found') {
        alert('No account found with this email.');
      } else {
        alert('Login failed: ' + error.message);
      }
    }
  }

  // ✅ Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
