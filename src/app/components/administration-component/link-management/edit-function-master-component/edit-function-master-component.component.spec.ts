import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFunctionMasterComponentComponent } from './edit-function-master-component.component';

describe('EditFunctionMasterComponentComponent', () => {
  let component: EditFunctionMasterComponentComponent;
  let fixture: ComponentFixture<EditFunctionMasterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFunctionMasterComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFunctionMasterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
