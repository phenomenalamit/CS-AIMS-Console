import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnvelopeComponentComponent } from './edit-envelope-component.component';

describe('EditEnvelopeComponentComponent', () => {
  let component: EditEnvelopeComponentComponent;
  let fixture: ComponentFixture<EditEnvelopeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEnvelopeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEnvelopeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
