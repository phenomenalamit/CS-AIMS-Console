import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTypeComponentComponent } from './view-user-type-component.component';

describe('ViewUserTypeComponentComponent', () => {
  let component: ViewUserTypeComponentComponent;
  let fixture: ComponentFixture<ViewUserTypeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserTypeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserTypeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
