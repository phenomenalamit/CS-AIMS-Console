import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrganizationComponentComponent } from './view-organization-component.component';

describe('ViewOrganizationComponentComponent', () => {
  let component: ViewOrganizationComponentComponent;
  let fixture: ComponentFixture<ViewOrganizationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOrganizationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrganizationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
