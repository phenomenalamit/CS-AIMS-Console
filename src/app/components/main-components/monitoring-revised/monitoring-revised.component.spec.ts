import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringRevisedComponent } from './monitoring-revised.component';

describe('MonitoringRevisedComponent', () => {
  let component: MonitoringRevisedComponent;
  let fixture: ComponentFixture<MonitoringRevisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringRevisedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
