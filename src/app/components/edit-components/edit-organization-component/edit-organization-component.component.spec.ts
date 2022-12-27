import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationComponentComponent } from './edit-organization-component.component';

describe('EditOrganizationComponentComponent', () => {
  let component: EditOrganizationComponentComponent;
  let fixture: ComponentFixture<EditOrganizationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOrganizationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
