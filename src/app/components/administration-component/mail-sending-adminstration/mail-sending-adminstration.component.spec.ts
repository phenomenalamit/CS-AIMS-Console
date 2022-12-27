import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSendingAdminstrationComponent } from './mail-sending-adminstration.component';

describe('MailSendingAdminstrationComponent', () => {
  let component: MailSendingAdminstrationComponent;
  let fixture: ComponentFixture<MailSendingAdminstrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailSendingAdminstrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSendingAdminstrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
