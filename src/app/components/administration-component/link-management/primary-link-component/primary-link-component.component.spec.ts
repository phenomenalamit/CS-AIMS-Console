import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryLinkComponentComponent } from './primary-link-component.component';

describe('PrimaryLinkComponentComponent', () => {
  let component: PrimaryLinkComponentComponent;
  let fixture: ComponentFixture<PrimaryLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
