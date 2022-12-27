import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalEnvelopeComponent } from './view-table-modal-envelope.component';

describe('ViewTableModalEnvelopeComponent', () => {
  let component: ViewTableModalEnvelopeComponent;
  let fixture: ComponentFixture<ViewTableModalEnvelopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalEnvelopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
