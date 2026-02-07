import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardFavorite } from './recipe-card-favorite';

describe('RecipeCardFavorite', () => {
  let component: RecipeCardFavorite;
  let fixture: ComponentFixture<RecipeCardFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardFavorite]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecipeCardFavorite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
