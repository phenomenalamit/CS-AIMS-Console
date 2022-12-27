import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishOrganizationComponent } from './publish-organization.component';

describe('PublishOrganizationComponent', () => {
  let component: PublishOrganizationComponent;
  let fixture: ComponentFixture<PublishOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
