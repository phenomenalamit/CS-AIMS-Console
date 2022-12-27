import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFundingComponentComponent } from './view-funding-component.component';

describe('ViewFundingComponentComponent', () => {
  let component: ViewFundingComponentComponent;
  let fixture: ComponentFixture<ViewFundingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFundingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFundingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
