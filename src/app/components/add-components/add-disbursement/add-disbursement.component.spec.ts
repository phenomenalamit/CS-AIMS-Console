import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisbursementComponent } from './add-disbursement.component';

describe('AddDisbursementComponent', () => {
  let component: AddDisbursementComponent;
  let fixture: ComponentFixture<AddDisbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDisbursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
