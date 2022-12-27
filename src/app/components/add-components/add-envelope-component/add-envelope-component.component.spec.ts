import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnvelopeComponentComponent } from './add-envelope-component.component';

describe('AddEnvelopeComponentComponent', () => {
  let component: AddEnvelopeComponentComponent;
  let fixture: ComponentFixture<AddEnvelopeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEnvelopeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEnvelopeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
