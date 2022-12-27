import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementDocumentViewComponent } from './disbursement-document-view.component';

describe('DisbursementDocumentViewComponent', () => {
  let component: DisbursementDocumentViewComponent;
  let fixture: ComponentFixture<DisbursementDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
