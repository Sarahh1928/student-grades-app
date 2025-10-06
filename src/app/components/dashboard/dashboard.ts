import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  grades$: Observable<any[]> | undefined;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const gradesRef = collection(this.firestore, 'grades');
    this.grades$ = collectionData(gradesRef, { idField: 'id' }) as Observable<any[]>;
  }

  goToAddGrade() {
    this.router.navigate(['/add-grade']);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
