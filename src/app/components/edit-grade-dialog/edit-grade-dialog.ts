import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface GradeData {
  studentId: string;
  studentName: string;
  week: number;
  daraga: number;
  emthan: number;
  mwazba: number;
}

@Component({
  selector: 'app-edit-grade-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-grade-dialog.html',
  styleUrls: ['./edit-grade-dialog.css']
})
export class EditGradeDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GradeData,
    private dialogRef: MatDialogRef<EditGradeDialog>
  ) {}

  save() {
    this.dialogRef.close(this.data);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
