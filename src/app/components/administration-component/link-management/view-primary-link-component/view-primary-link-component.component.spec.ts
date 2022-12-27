import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrimaryLinkComponentComponent } from './view-primary-link-component.component';

describe('ViewPrimaryLinkComponentComponent', () => {
  let component: ViewPrimaryLinkComponentComponent;
  let fixture: ComponentFixture<ViewPrimaryLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPrimaryLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrimaryLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
