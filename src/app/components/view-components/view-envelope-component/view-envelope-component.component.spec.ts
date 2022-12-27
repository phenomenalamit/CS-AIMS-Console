import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnvelopeComponentComponent } from './view-envelope-component.component';

describe('ViewEnvelopeComponentComponent', () => {
  let component: ViewEnvelopeComponentComponent;
  let fixture: ComponentFixture<ViewEnvelopeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEnvelopeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEnvelopeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
