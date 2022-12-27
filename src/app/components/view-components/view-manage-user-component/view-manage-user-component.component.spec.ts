import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManageUserComponentComponent } from './view-manage-user-component.component';

describe('ViewManageUserComponentComponent', () => {
  let component: ViewManageUserComponentComponent;
  let fixture: ComponentFixture<ViewManageUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManageUserComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManageUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
