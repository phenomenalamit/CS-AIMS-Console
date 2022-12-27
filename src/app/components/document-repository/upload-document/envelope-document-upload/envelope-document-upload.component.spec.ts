import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopeDocumentUploadComponent } from './envelope-document-upload.component';

describe('EnvelopeDocumentUploadComponent', () => {
  let component: EnvelopeDocumentUploadComponent;
  let fixture: ComponentFixture<EnvelopeDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvelopeDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
