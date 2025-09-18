import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Score } from './score';

describe('Score', () => {
  let component: Score;
  let fixture: ComponentFixture<Score>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Score]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Score);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
