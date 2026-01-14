import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCategoryList } from './user-category-list';

describe('UserCategoryList', () => {
  let component: UserCategoryList;
  let fixture: ComponentFixture<UserCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
