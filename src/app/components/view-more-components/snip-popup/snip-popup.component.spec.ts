import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnipPopupComponent } from './snip-popup.component';

describe('SnipPopupComponent', () => {
  let component: SnipPopupComponent;
  let fixture: ComponentFixture<SnipPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnipPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnipPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
