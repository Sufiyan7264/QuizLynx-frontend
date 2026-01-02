import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiGenerator } from './ai-generator';

describe('AiGenerator', () => {
  let component: AiGenerator;
  let fixture: ComponentFixture<AiGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
