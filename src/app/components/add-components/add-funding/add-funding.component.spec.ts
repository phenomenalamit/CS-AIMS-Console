import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFundingComponent } from './add-funding.component';

describe('AddFundingComponent', () => {
  let component: AddFundingComponent;
  let fixture: ComponentFixture<AddFundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFundingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
