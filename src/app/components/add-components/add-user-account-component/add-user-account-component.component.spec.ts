import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserAccountComponentComponent } from './add-user-account-component.component';

describe('AddUserAccountComponentComponent', () => {
  let component: AddUserAccountComponentComponent;
  let fixture: ComponentFixture<AddUserAccountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserAccountComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserAccountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
