import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipeCard } from './my-recipe-card';

describe('MyRecipeCard', () => {
  let component: MyRecipeCard;
  let fixture: ComponentFixture<MyRecipeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecipeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecipeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
