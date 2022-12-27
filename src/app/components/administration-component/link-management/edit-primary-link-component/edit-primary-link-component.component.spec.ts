import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrimaryLinkComponentComponent } from './edit-primary-link-component.component';

describe('EditPrimaryLinkComponentComponent', () => {
  let component: EditPrimaryLinkComponentComponent;
  let fixture: ComponentFixture<EditPrimaryLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPrimaryLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPrimaryLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
