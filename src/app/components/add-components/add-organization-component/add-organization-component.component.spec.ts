import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganizationComponentComponent } from './add-organization-component.component';

describe('AddOrganizationComponentComponent', () => {
  let component: AddOrganizationComponentComponent;
  let fixture: ComponentFixture<AddOrganizationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrganizationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrganizationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
