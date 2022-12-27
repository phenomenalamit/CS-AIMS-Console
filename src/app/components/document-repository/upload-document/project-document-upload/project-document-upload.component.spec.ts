import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentUploadComponent } from './project-document-upload.component';

describe('ProjectDocumentUploadComponent', () => {
  let component: ProjectDocumentUploadComponent;
  let fixture: ComponentFixture<ProjectDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
