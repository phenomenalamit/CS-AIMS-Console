import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentComponentComponent } from './edit-payment-component.component';

describe('EditPaymentComponentComponent', () => {
  let component: EditPaymentComponentComponent;
  let fixture: ComponentFixture<EditPaymentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
