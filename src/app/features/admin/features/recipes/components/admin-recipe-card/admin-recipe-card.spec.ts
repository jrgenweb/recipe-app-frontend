import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecipeCard } from './admin-recipe-card';

describe('AdminRecipeCard', () => {
  let component: AdminRecipeCard;
  let fixture: ComponentFixture<AdminRecipeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecipeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecipeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
