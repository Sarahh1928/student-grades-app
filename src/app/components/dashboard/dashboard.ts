import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { NgFor, AsyncPipe, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradesService } from '../../services/grades-service';
import { MatDialog } from '@angular/material/dialog';
import { EditGradeDialog } from '../edit-grade-dialog/edit-grade-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface WeekGrade {
  id?: string;
  studentName: string;
  week: number;
  daraga: number;
  emthan: number;
  mwazba: number;
  studentId?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf, FormsModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  allGrades: WeekGrade[] = [];
  filteredGrades: WeekGrade[] = [];
  availableWeeks: number[] = [];
  selectedWeek: string = '';
  averageMwazba = 0;
  averageDaraga = 0;
  averageEmthan = 0;
  dataLoaded = false;

  constructor(
    private gradesService: GradesService,
    private router: Router,
    private auth: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit(): Promise<void> {
    this.gradesService.getAllWeeksOnce().subscribe((weeks) => {
      console.log('Weeks retrieved:', weeks);

      if (!weeks.length) {
        this.dataLoaded = true;
        return;
      }

      // Map Firestore docs into your WeekGrade interface
      this.allGrades = weeks.map((w: any) => ({
        id: w.id,
        studentName: w.studentName || 'غير معروف',
        week: w.week,
        daraga: w.daraga,
        emthan: w.emthan,
        mwazba: w.mwazba,
        studentId: w.studentId
      }));

      // Copy to filteredGrades
      this.filteredGrades = [...this.allGrades];

      // Get all distinct weeks
      const weeksSet = new Set<number>(this.allGrades.map((g) => g.week));
      this.availableWeeks = Array.from(weeksSet).sort((a, b) => a - b);

      this.calculateAverages();
      this.dataLoaded = true;
    });
  }

  calculateAverages(): void {
    if (this.filteredGrades.length > 0) {
      const n = this.filteredGrades.length;
      this.averageDaraga =
        this.filteredGrades.reduce((sum, g) => sum + (g.daraga || 0), 0) / n;
      this.averageEmthan =
        this.filteredGrades.reduce((sum, g) => sum + (g.emthan || 0), 0) / n;
      this.averageMwazba =
        this.filteredGrades.reduce((sum, g) => sum + (g.mwazba || 0), 0) / n;
    } else {
      this.averageDaraga = this.averageEmthan = this.averageMwazba = 0;
    }
  }

  filterByWeek(): void {
    if (!this.selectedWeek) {
      this.filteredGrades = [...this.allGrades];
    } else {
      const weekNum = Number(this.selectedWeek);
      this.filteredGrades = this.allGrades.filter((g) => g.week === weekNum);
    }
    this.calculateAverages();
  }

  goToAddGrade(): void {
    this.router.navigate(['/add-grade']);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // ✏️ Open edit popup using MatDialog
  openEditDialog(grade: WeekGrade): void {
    const dialogRef = this.dialog.open(EditGradeDialog, {
      width: '400px',
      data: { ...grade }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.gradesService.updateWeekGrade(
            result.studentId,
            `week_${result.week}`,
            {
              daraga: result.daraga,
              emthan: result.emthan,
              mwazba: result.mwazba,
              studentName: result.studentName,
              week: result.week
            }
          );

          // ✅ Force change detection by creating a new array reference
          this.allGrades = this.allGrades.map(g =>
            g.studentId === result.studentId && g.week === result.week
              ? { ...g, ...result }
              : g
          );

          // ✅ Update filteredGrades too
          this.filterByWeek();
          this.calculateAverages();

          this.snackBar.open('✅ تم تعديل البيانات بنجاح', 'إغلاق', {
            duration: 3000
          });
        } catch (err) {
          console.error('❌ Error updating grade:', err);
          this.snackBar.open('حدث خطأ أثناء تحديث البيانات.', 'إغلاق', {
            duration: 3000
          });
        }
      }
    });
  }


  async deleteGrade(grade: WeekGrade): Promise<void> {
    if (!grade.studentId) return;

    const confirmDelete = confirm(`هل أنت متأكد من حذف أسبوع ${grade.week} للطالب ${grade.studentName}؟`);
    if (!confirmDelete) return;

    try {
      await this.gradesService.deleteWeek(grade.studentId, `week_${grade.week}`);

      // ✅ Remove locally and force update
      this.allGrades = this.allGrades.filter(
        g => !(g.studentId === grade.studentId && g.week === grade.week)
      );

      this.filterByWeek();
      this.calculateAverages();

      this.snackBar.open('🗑️ تم حذف الدرجة بنجاح', 'إغلاق', {
        duration: 3000
      });
    } catch (err) {
      console.error('❌ Error deleting grade:', err);
      this.snackBar.open('حدث خطأ أثناء حذف الدرجة.', 'إغلاق', {
        duration: 3000
      });
    }
  }

}
