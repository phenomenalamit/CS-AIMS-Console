import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonitoringRevisedComponent } from './add-monitoring-revised.component';

describe('AddMonitoringRevisedComponent', () => {
  let component: AddMonitoringRevisedComponent;
  let fixture: ComponentFixture<AddMonitoringRevisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMonitoringRevisedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMonitoringRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
