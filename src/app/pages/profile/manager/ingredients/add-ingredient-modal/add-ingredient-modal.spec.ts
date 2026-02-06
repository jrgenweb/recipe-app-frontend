import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIngredientModal } from './add-ingredient-modal';

describe('AddIngredientModal', () => {
  let component: AddIngredientModal;
  let fixture: ComponentFixture<AddIngredientModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIngredientModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIngredientModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
