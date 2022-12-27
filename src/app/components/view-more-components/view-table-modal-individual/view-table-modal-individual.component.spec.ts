import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalIndividualComponent } from './view-table-modal-individual.component';

describe('ViewTableModalIndividualComponent', () => {
  let component: ViewTableModalIndividualComponent;
  let fixture: ComponentFixture<ViewTableModalIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
