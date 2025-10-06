import { Component, NgZone, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import {  NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-grade',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  templateUrl: './add-grade.html',
  styleUrl: './add-grade.css'
})
export class AddGrade implements OnInit {
  students$: Observable<any[]> | undefined;
  selectedStudentId: string = '';
  exam: string = '';
  grade: number | null = null;
  message: string = '';

  constructor(private firestore: Firestore, private router: Router, private zone: NgZone) {}

  ngOnInit(): void {
    const studentsRef = collection(this.firestore, 'students');
    const q = query(studentsRef, orderBy('name')); // use your 'name' field
    this.students$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  async addGrade() {
    if (!this.selectedStudentId || !this.exam || this.grade === null) {
      this.message = '⚠️ Please fill all fields before submitting.';
      return;
    }

    // ✅ get the student's name by ID
    const students = await firstValueFrom(this.students$!);
    const student = students.find(s => s.id === this.selectedStudentId);

    if (!student) {
      this.message = '❌ Student not found.';
      return;
    }

    // ✅ add grade with student name included
    const gradesRef = collection(this.firestore, 'grades');
    await addDoc(gradesRef, {
      studentId: this.selectedStudentId,
      studentName: student.name,
      exam: this.exam,
      grade: this.grade,
      createdAt: new Date()
    });

    // ✅ feedback + clear fields
    this.zone.run(() => {
      this.message = '✅ Grade added successfully!';
      this.selectedStudentId = '';
      this.exam = '';
      this.grade = null;
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
