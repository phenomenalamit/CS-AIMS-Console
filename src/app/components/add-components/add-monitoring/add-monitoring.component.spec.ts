import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonitoringComponent } from './add-monitoring.component';

describe('AddMonitoringComponent', () => {
  let component: AddMonitoringComponent;
  let fixture: ComponentFixture<AddMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
