import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuisinModal } from './add-cuisin-modal';

describe('AddCuisinModal', () => {
  let component: AddCuisinModal;
  let fixture: ComponentFixture<AddCuisinModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCuisinModal]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddCuisinModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
