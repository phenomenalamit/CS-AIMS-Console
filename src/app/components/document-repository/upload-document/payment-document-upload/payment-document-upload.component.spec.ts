import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDocumentUploadComponent } from './payment-document-upload.component';

describe('PaymentDocumentUploadComponent', () => {
  let component: PaymentDocumentUploadComponent;
  let fixture: ComponentFixture<PaymentDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
