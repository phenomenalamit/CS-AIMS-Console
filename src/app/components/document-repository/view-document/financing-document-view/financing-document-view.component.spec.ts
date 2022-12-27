import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancingDocumentViewComponent } from './financing-document-view.component';

describe('FinancingDocumentViewComponent', () => {
  let component: FinancingDocumentViewComponent;
  let fixture: ComponentFixture<FinancingDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancingDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancingDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
