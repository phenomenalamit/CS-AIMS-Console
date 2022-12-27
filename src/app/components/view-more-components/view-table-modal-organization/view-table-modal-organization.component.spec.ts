import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalOrganizationComponent } from './view-table-modal-organization.component';

describe('ViewTableModalOrganizationComponent', () => {
  let component: ViewTableModalOrganizationComponent;
  let fixture: ComponentFixture<ViewTableModalOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
