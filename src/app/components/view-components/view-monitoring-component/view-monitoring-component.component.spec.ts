import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMonitoringComponentComponent } from './view-monitoring-component.component';

describe('ViewMonitoringComponentComponent', () => {
  let component: ViewMonitoringComponentComponent;
  let fixture: ComponentFixture<ViewMonitoringComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMonitoringComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMonitoringComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
