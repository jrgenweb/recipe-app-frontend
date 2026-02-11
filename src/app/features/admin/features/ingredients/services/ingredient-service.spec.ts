import { TestBed } from '@angular/core/testing';
import { AdminIngredientService } from './admin-ingredient.service';

describe('AdminIngredientService', () => {
  let service: AdminIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
