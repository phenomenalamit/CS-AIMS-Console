import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAdministrationComponent } from './report-administration.component';

describe('ReportAdministrationComponent', () => {
  let component: ReportAdministrationComponent;
  let fixture: ComponentFixture<ReportAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
