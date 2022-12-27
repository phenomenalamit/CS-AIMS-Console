import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGlobalLinkComponentComponent } from './view-global-link-component.component';

describe('ViewGlobalLinkComponentComponent', () => {
  let component: ViewGlobalLinkComponentComponent;
  let fixture: ComponentFixture<ViewGlobalLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGlobalLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGlobalLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
