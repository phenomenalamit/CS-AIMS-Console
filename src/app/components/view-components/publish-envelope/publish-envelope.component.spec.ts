import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishEnvelopeComponent } from './publish-envelope.component';

describe('PublishEnvelopeComponent', () => {
  let component: PublishEnvelopeComponent;
  let fixture: ComponentFixture<PublishEnvelopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishEnvelopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
