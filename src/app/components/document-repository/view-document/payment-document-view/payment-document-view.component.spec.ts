import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDocumentViewComponent } from './payment-document-view.component';

describe('PaymentDocumentViewComponent', () => {
  let component: PaymentDocumentViewComponent;
  let fixture: ComponentFixture<PaymentDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
