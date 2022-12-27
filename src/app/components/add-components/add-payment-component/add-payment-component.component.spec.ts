import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentComponentComponent } from './add-payment-component.component';

describe('AddPaymentComponentComponent', () => {
  let component: AddPaymentComponentComponent;
  let fixture: ComponentFixture<AddPaymentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
