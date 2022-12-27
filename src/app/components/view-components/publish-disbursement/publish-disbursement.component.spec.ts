import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishDisbursementComponent } from './publish-disbursement.component';

describe('PublishDisbursementComponent', () => {
  let component: PublishDisbursementComponent;
  let fixture: ComponentFixture<PublishDisbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishDisbursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
