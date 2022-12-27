import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopeDocumentViewComponent } from './envelope-document-view.component';

describe('EnvelopeDocumentViewComponent', () => {
  let component: EnvelopeDocumentViewComponent;
  let fixture: ComponentFixture<EnvelopeDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvelopeDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
