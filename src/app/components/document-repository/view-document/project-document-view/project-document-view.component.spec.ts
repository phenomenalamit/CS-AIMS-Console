import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentViewComponent } from './project-document-view.component';

describe('ProjectDocumentViewComponent', () => {
  let component: ProjectDocumentViewComponent;
  let fixture: ComponentFixture<ProjectDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
