import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancingDocumentUploadComponent } from './financing-document-upload.component';

describe('FinancingDocumentUploadComponent', () => {
  let component: FinancingDocumentUploadComponent;
  let fixture: ComponentFixture<FinancingDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancingDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancingDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
