import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDocumentUploadComponent } from './monitoring-document-upload.component';

describe('MonitoringDocumentUploadComponent', () => {
  let component: MonitoringDocumentUploadComponent;
  let fixture: ComponentFixture<MonitoringDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
