import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserAccountComponentComponent } from './edit-user-account-component.component';

describe('EditUserAccountComponentComponent', () => {
  let component: EditUserAccountComponentComponent;
  let fixture: ComponentFixture<EditUserAccountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserAccountComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAccountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
