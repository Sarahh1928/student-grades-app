import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, orderBy, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradesService } from '../../services/grades-service'; // ✅ import your service

@Component({
  selector: 'app-add-grade',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  templateUrl: './add-grade.html',
  styleUrls: ['./add-grade.css']
})
export class AddGrade implements OnInit {
  students$: Observable<any[]> | undefined;
  selectedStudentId: string = '';
  weekNum: number | null = null;
  daraga: number | null = null;
  emthan: number | null = null;
  mwazba: number | null = null;
  message$ = new BehaviorSubject<string>(''); 

  constructor(
    private firestore: Firestore,
    private router: Router,
    private gradesService: GradesService
  ) { }

  ngOnInit(): void {
    const studentsRef = collection(this.firestore, 'students');
    const q = query(studentsRef, orderBy('name'));
    this.students$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  async addWeekGrade() {
    if (
      !this.selectedStudentId ||
      this.weekNum === null ||
      this.daraga === null ||
      this.emthan === null ||
      this.mwazba === null
    ) {
      this.message$.next('⚠️ يرجى تعبئة جميع الحقول.');
      return;
    }

    this.message$.next('⏳ جاري الإضافة...');

    try {
      const students = await firstValueFrom(this.students$!);
      const student = students.find(s => s.id === this.selectedStudentId);
      if (!student) {
        this.message$.next('❌ الطالب غير موجود.');
        return;
      }

      const weekName = `week_${this.weekNum}`;
      const weekData = {
        week: this.weekNum,
        daraga: this.daraga,
        emthan: this.emthan,
        mwazba: this.mwazba,
        studentName: student.name
      };

      // ✅ Call the service and get its response
      const result = await this.gradesService.addWeekGrade(this.selectedStudentId, weekName, weekData);
      console.log('Add week result:', result);
      // ✅ Use returned message
      this.message$.next('');
      this.message$.next(result.message);

      console.log("this.message ", this.message$);
      console.log("result.message ", result.message);
      console.log("result.data ", result.data);

      // ✅ Reset form
      this.weekNum = null;
      this.daraga = null;
      this.emthan = null;
      this.mwazba = null;
      this.selectedStudentId = '';

      // ✅ Auto-hide message after 3s
      setTimeout(() => this.message$.next(''), 3000);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        this.message$.next(`⚠️ بيانات الأسبوع ${this.weekNum} موجودة بالفعل. عدّلها من نموذج الدرجات.`);
      } else {
        this.message$.next('❌ حدث خطأ أثناء الإضافة. حاول مرة أخرى.');
        console.error(err);
      }
    }
  }



  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
