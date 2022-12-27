import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogboxPaymentComponentComponent } from './dialogbox-payment-component.component';

describe('DialogboxPaymentComponentComponent', () => {
  let component: DialogboxPaymentComponentComponent;
  let fixture: ComponentFixture<DialogboxPaymentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogboxPaymentComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogboxPaymentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
