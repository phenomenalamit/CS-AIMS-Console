import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManageUserComponentComponent } from './add-manage-user-component.component';

describe('AddManageUserComponentComponent', () => {
  let component: AddManageUserComponentComponent;
  let fixture: ComponentFixture<AddManageUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManageUserComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManageUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
