import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGradeDialog } from './edit-grade-dialog';

describe('EditGradeDialog', () => {
  let component: EditGradeDialog;
  let fixture: ComponentFixture<EditGradeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGradeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGradeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
