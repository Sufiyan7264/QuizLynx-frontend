import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInstructorDashboard } from './student-instructor-dashboard';

describe('StudentInstructorDashboard', () => {
  let component: StudentInstructorDashboard;
  let fixture: ComponentFixture<StudentInstructorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInstructorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInstructorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

