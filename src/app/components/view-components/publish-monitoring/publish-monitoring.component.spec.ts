import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishMonitoringComponent } from './publish-monitoring.component';

describe('PublishMonitoringComponent', () => {
  let component: PublishMonitoringComponent;
  let fixture: ComponentFixture<PublishMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
