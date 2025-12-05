import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartConfiguration } from './chart-configuration';

describe('ChartConfiguration', () => {
  let component: ChartConfiguration;
  let fixture: ComponentFixture<ChartConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartConfiguration]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartConfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


