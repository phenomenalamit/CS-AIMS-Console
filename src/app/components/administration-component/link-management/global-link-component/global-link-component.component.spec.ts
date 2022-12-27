import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalLinkComponentComponent } from './global-link-component.component';

describe('GlobalLinkComponentComponent', () => {
  let component: GlobalLinkComponentComponent;
  let fixture: ComponentFixture<GlobalLinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalLinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
