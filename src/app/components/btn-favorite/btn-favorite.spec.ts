import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFavorite } from './btn-favorite';

describe('BtnFavorite', () => {
  let component: BtnFavorite;
  let fixture: ComponentFixture<BtnFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnFavorite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnFavorite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
