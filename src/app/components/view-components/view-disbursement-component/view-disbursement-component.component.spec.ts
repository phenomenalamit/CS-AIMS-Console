import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDisbursementComponentComponent } from './view-disbursement-component.component';

describe('ViewDisbursementComponentComponent', () => {
  let component: ViewDisbursementComponentComponent;
  let fixture: ComponentFixture<ViewDisbursementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDisbursementComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDisbursementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
