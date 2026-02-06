import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFilter } from './recipe-filter';

describe('RecipeFilter', () => {
  let component: RecipeFilter;
  let fixture: ComponentFixture<RecipeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
