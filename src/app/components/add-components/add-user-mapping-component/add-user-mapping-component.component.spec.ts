import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserMappingComponentComponent } from './add-user-mapping-component.component';

describe('AddUserMappingComponentComponent', () => {
  let component: AddUserMappingComponentComponent;
  let fixture: ComponentFixture<AddUserMappingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserMappingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserMappingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
