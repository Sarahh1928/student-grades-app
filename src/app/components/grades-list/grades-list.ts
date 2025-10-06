import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-grades-list',
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './grades-list.html',
  styleUrl: './grades-list.css'
})
export class GradesList implements OnInit {
  grades$: Observable<any[]> | undefined;
  userEmail: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userEmail = user.email;

    const gradesRef = collection(this.firestore, 'grades');
    // ✅ query by studentId instead of studentEmail
    const studentGradesQuery = query(gradesRef, where('studentId', '==', user.uid));

    this.grades$ = collectionData(studentGradesQuery, { idField: 'id' }) as Observable<any[]>;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
