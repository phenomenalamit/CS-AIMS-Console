import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFunctionMasterComponentComponent } from './view-function-master-component.component';

describe('ViewFunctionMasterComponentComponent', () => {
  let component: ViewFunctionMasterComponentComponent;
  let fixture: ComponentFixture<ViewFunctionMasterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFunctionMasterComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFunctionMasterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
