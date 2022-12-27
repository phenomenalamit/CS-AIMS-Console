import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartdashComponent } from './piechartdash.component';

describe('PiechartdashComponent', () => {
  let component: PiechartdashComponent;
  let fixture: ComponentFixture<PiechartdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiechartdashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiechartdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
