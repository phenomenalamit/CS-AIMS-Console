import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentComponentComponent } from './view-payment-component.component';

describe('ViewPaymentComponentComponent', () => {
  let component: ViewPaymentComponentComponent;
  let fixture: ComponentFixture<ViewPaymentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPaymentComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaymentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
