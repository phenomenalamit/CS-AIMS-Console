import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndividualComponentComponent } from './view-individual-component.component';

describe('ViewIndividualComponentComponent', () => {
  let component: ViewIndividualComponentComponent;
  let fixture: ComponentFixture<ViewIndividualComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIndividualComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIndividualComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
