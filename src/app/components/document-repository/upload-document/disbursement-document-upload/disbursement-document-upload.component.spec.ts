import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementDocumentUploadComponent } from './disbursement-document-upload.component';

describe('DisbursementDocumentUploadComponent', () => {
  let component: DisbursementDocumentUploadComponent;
  let fixture: ComponentFixture<DisbursementDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
