import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalMonitoringComponent } from './view-table-modal-monitoring.component';

describe('ViewTableModalMonitoringComponent', () => {
  let component: ViewTableModalMonitoringComponent;
  let fixture: ComponentFixture<ViewTableModalMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
