import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMonitoringComponent } from './edit-monitoring.component';

describe('EditMonitoringComponent', () => {
  let component: EditMonitoringComponent;
  let fixture: ComponentFixture<EditMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
