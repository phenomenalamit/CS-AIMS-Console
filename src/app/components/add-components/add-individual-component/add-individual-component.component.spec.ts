import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndividualComponentComponent } from './add-individual-component.component';

describe('AddIndividualComponentComponent', () => {
  let component: AddIndividualComponentComponent;
  let fixture: ComponentFixture<AddIndividualComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIndividualComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIndividualComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
