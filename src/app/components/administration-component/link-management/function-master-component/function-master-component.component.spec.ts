import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionMasterComponentComponent } from './function-master-component.component';

describe('FunctionMasterComponentComponent', () => {
  let component: FunctionMasterComponentComponent;
  let fixture: ComponentFixture<FunctionMasterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionMasterComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionMasterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
