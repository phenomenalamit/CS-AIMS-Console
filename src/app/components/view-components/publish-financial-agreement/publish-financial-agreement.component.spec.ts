import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishFinancialAgreementComponent } from './publish-financial-agreement.component';

describe('PublishFinancialAgreementComponent', () => {
  let component: PublishFinancialAgreementComponent;
  let fixture: ComponentFixture<PublishFinancialAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishFinancialAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishFinancialAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
