import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserTypeComponentComponent } from './add-user-type-component.component';

describe('AddUserTypeComponentComponent', () => {
  let component: AddUserTypeComponentComponent;
  let fixture: ComponentFixture<AddUserTypeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserTypeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserTypeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
