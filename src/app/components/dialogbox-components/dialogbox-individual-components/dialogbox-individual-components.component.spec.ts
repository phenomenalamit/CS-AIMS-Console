import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogboxIndividualComponentsComponent } from './dialogbox-individual-components.component';

describe('DialogboxIndividualComponentsComponent', () => {
  let component: DialogboxIndividualComponentsComponent;
  let fixture: ComponentFixture<DialogboxIndividualComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogboxIndividualComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogboxIndividualComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
