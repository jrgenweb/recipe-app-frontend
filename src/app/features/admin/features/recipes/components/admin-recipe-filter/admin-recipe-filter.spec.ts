import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecipeFilter } from './admin-recipe-filter';

describe('AdminRecipeFilter', () => {
  let component: AdminRecipeFilter;
  let fixture: ComponentFixture<AdminRecipeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecipeFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecipeFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
