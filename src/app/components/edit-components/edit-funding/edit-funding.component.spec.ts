import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFundingComponent } from './edit-funding.component';

describe('EditFundingComponent', () => {
  let component: EditFundingComponent;
  let fixture: ComponentFixture<EditFundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFundingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
