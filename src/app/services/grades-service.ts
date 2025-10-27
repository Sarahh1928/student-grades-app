import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  collectionData,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import {
  collectionGroup,
  onSnapshot,
  Query,
  DocumentData,
} from '@angular/fire/firestore';
import { getDocs } from 'firebase/firestore';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GradesService {
  constructor(private firestore: Firestore) { }

  // ✅ Try adding a new week — if duplicate exists, throw a custom error
  async addWeekGrade(studentId: string, weekName: string, weekData: any) {
    const weekRef = doc(this.firestore, `grades/${studentId}/weeks/${weekName}`);
    const existingWeek = await getDoc(weekRef);

    if (existingWeek.exists()) {
      // ❌ Duplicate found → reject instead of overwriting
      throw new Error(`A record for "${weekName}" already exists for this student.`);
    }

    // Otherwise → create new
    await setDoc(weekRef, {
      ...weekData,
      createdAt: new Date()
    });

    console.log(`✅ Added new week "${weekName}" for ${studentId}`);
    return {
    success: true,
    message: `✅ تم إضافة الأسبوع ${weekData.week} للطالب ${weekData.studentName} بنجاح.`,
    data: weekData
  };
  }

  // ✅ Update an existing week
  updateWeekGrade(studentId: string, weekName: string, data: any) {
    console.log('Updating week grade:', studentId, weekName, data);
    const docRef = doc(this.firestore, `grades/${studentId}/weeks/${weekName}`);
    return updateDoc(docRef, data);
  }

  // ✅ Get all weeks for one student
  getStudentGrades(studentId: string): Observable<any[]> {
    const weeksRef = collection(this.firestore, `grades/${studentId}/weeks`);
    return collectionData(weeksRef, { idField: 'id' });
  }

  // ✅ Get all students
  getAllStudents(): Observable<any[]> {
    const weeksGroup = collectionGroup(this.firestore, 'weeks');
    return collectionData(weeksGroup, { idField: 'id' });
  }
  getAllWeeksOnce(): Observable<any[]> {
    const weeksQuery = collectionGroup(this.firestore, 'weeks');

    return from(
      getDocs(weeksQuery).then((snapshot) =>
        snapshot.docs.map((docSnap) => {
          const studentId = docSnap.ref.parent.parent?.id;
          const data = docSnap.data();

          return {
            id: docSnap.id,
            studentId,
            ...data
          };
        })
      )
    );
  }

  // ✅ Delete a specific week
  deleteWeek(studentId: string, weekName: string) {
    const docRef = doc(this.firestore, `grades/${studentId}/weeks/${weekName}`);
    return deleteDoc(docRef);
  }
}
