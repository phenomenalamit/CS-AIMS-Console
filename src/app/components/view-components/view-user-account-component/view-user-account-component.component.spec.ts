import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserAccountComponentComponent } from './view-user-account-component.component';

describe('ViewUserAccountComponentComponent', () => {
  let component: ViewUserAccountComponentComponent;
  let fixture: ComponentFixture<ViewUserAccountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserAccountComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserAccountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
