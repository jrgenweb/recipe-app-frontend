import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeGallery } from './recipe-gallery';

describe('RecipeGallery', () => {
  let component: RecipeGallery;
  let fixture: ComponentFixture<RecipeGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
