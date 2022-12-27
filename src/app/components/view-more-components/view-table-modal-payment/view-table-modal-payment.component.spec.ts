import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalPaymentComponent } from './view-table-modal-payment.component';

describe('ViewTableModalPaymentComponent', () => {
  let component: ViewTableModalPaymentComponent;
  let fixture: ComponentFixture<ViewTableModalPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
