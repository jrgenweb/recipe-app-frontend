import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipe } from './add-recipe';

describe('Add', () => {
  let component: AddRecipe;
  let fixture: ComponentFixture<AddRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipe],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
