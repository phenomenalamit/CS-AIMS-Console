import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalDisbursmentComponent } from './view-table-modal-disbursment.component';

describe('ViewTableModalDisbursmentComponent', () => {
  let component: ViewTableModalDisbursmentComponent;
  let fixture: ComponentFixture<ViewTableModalDisbursmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalDisbursmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalDisbursmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
