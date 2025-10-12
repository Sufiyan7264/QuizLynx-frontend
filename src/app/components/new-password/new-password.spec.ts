import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPassword } from './new-password';

describe('NewPassword', () => {
  let component: NewPassword;
  let fixture: ComponentFixture<NewPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
