import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalFinancialAgreementComponent } from './view-table-modal-financial-agreement.component';

describe('ViewTableModalFinancialAgreementComponent', () => {
  let component: ViewTableModalFinancialAgreementComponent;
  let fixture: ComponentFixture<ViewTableModalFinancialAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalFinancialAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalFinancialAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
