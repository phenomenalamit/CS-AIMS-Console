import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishAdministrationComponent } from './publish-administration.component';

describe('PublishAdministrationComponent', () => {
  let component: PublishAdministrationComponent;
  let fixture: ComponentFixture<PublishAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
