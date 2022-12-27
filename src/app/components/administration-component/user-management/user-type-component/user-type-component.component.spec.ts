import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeComponentComponent } from './user-type-component.component';

describe('UserTypeComponentComponent', () => {
  let component: UserTypeComponentComponent;
  let fixture: ComponentFixture<UserTypeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTypeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
