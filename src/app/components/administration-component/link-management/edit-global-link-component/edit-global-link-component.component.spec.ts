import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlobalLinkComponentComponent } from './edit-global-link-component.component';

describe('EditGlobalLinkComponentComponent', () => {
  let component: EditGlobalLinkComponentComponent;
  let fixture: ComponentFixture<EditGlobalLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGlobalLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGlobalLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
