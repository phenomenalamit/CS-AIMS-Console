import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDocumentViewComponent } from './monitoring-document-view.component';

describe('MonitoringDocumentViewComponent', () => {
  let component: MonitoringDocumentViewComponent;
  let fixture: ComponentFixture<MonitoringDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
