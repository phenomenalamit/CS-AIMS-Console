import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrimaryLinkComponentComponent } from './create-primary-link-component.component';

describe('CreatePrimaryLinkComponentComponent', () => {
  let component: CreatePrimaryLinkComponentComponent;
  let fixture: ComponentFixture<CreatePrimaryLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePrimaryLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrimaryLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
