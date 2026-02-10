import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavBar } from './admin-nav-bar';

describe('AdminNavBar', () => {
  let component: AdminNavBar;
  let fixture: ComponentFixture<AdminNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNavBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
