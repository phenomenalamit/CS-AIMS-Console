import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateAdministrationComponent } from './exchange-rate-administration.component';

describe('ExchangeRateAdministrationComponent', () => {
  let component: ExchangeRateAdministrationComponent;
  let fixture: ComponentFixture<ExchangeRateAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
