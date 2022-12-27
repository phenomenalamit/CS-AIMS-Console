import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewColumnAccessAdministrationComponent } from './view-column-access-administration.component';

describe('ViewColumnAccessAdministrationComponent', () => {
  let component: ViewColumnAccessAdministrationComponent;
  let fixture: ComponentFixture<ViewColumnAccessAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewColumnAccessAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewColumnAccessAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
