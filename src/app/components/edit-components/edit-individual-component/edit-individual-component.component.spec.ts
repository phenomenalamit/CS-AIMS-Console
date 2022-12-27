import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIndividualComponentComponent } from './edit-individual-component.component';

describe('EditIndividualComponentComponent', () => {
  let component: EditIndividualComponentComponent;
  let fixture: ComponentFixture<EditIndividualComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIndividualComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIndividualComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
