import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfCircle } from './half-circle';

describe('HalfCircle', () => {
  let component: HalfCircle;
  let fixture: ComponentFixture<HalfCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalfCircle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalfCircle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
