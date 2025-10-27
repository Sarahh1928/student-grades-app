import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { onAuthStateChanged } from 'firebase/auth';
import { GradesService } from '../../services/grades-service';
import { Observable } from 'rxjs';

interface WeekGrade {
  week: number;
  daraga: number;
  emthan: number;
  mwazba: number;
}

@Component({
  selector: 'app-grades-list',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './grades-list.html',
  styleUrls: ['./grades-list.css']
})
export class GradesList implements OnInit {
  userEmail: string | null = null;
  weekNumbers: number[] = [];
  selectedWeek: number | null = null;
  filteredGrades: WeekGrade[] = [];
  allGrades: WeekGrade[] = [];
  loading = true;

  constructor(
    private auth: Auth,
    private router: Router,
    private gradesService: GradesService
  ) { }

  ngOnInit(): void {
    console.log('--- ngOnInit start ---');

    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        console.log('No user found, redirecting to login...');
        this.router.navigate(['/login']);
        return;
      }

      this.userEmail = user.email;
      console.log('Current user:', user.uid, this.userEmail);

      this.loadGrades(user.uid);
    });
  }

  private loadGrades(uid: string) {
  console.log('Fetching grades for user ID:', uid);
  this.gradesService.getAllWeeksOnce().subscribe((data: any[]) => {
    console.log('Grades data retrieved:', data);

    const mergedGrades: WeekGrade[] = [];

    data.forEach(doc => {
      console.log('Checking document:', doc);
      // 🔥 Firestore structure: each doc = one week for one student
      if (doc.studentId === uid) {
        mergedGrades.push({
          week: doc.week,
          daraga: doc.daraga,
          emthan: doc.emthan,
          mwazba: doc.mwazba
        });
      }
    });

    this.allGrades = mergedGrades;
    this.filteredGrades = [...mergedGrades];

    this.weekNumbers = Array.from(new Set(mergedGrades.map(g => g.week))).sort((a, b) => a - b);

    console.log('Week numbers:', this.weekNumbers);
    console.log('Filtered grades:', this.filteredGrades);

    this.selectedWeek = null; // default: all weeks
    this.loading = false;
    console.log('--- ngOnInit end ---', this.loading);
  });
}




  filterWeek() {
    console.log('Filtering for week:', this.selectedWeek);
    if (!this.selectedWeek) {
      console.log('No week selected, showing all grades');
      this.filteredGrades = [...this.allGrades];
    } else {
      const weekNum = Number(this.selectedWeek);
      this.filteredGrades = this.allGrades.filter(g => g.week === weekNum);
      console.log('Filtered grades for week', weekNum, ':', this.filteredGrades);
    }
  }

  async logout() {
    console.log('Logging out user...');
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
