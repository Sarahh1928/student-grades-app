import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GradesService {
  constructor(private firestore: Firestore) {}

  addGrade(data: any) {
    const gradesRef = collection(this.firestore, 'grades');
    return addDoc(gradesRef, data);
  }

  getGrades(): Observable<any[]> {
    const gradesRef = collection(this.firestore, 'grades');
    return collectionData(gradesRef, { idField: 'id' });
  }

  updateGrade(id: string, data: any) {
    const docRef = doc(this.firestore, `grades/${id}`);
    return updateDoc(docRef, data);
  }

  deleteGrade(id: string) {
    const docRef = doc(this.firestore, `grades/${id}`);
    return deleteDoc(docRef);
  }
}
