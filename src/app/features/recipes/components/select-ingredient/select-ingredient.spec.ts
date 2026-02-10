import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIngredient } from './select-ingredient';

describe('SelectIngredient', () => {
  let component: SelectIngredient;
  let fixture: ComponentFixture<SelectIngredient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectIngredient]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectIngredient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
