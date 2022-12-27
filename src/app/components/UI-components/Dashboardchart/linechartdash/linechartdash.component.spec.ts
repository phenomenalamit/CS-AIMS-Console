import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechartdashComponent } from './linechartdash.component';

describe('LinechartdashComponent', () => {
  let component: LinechartdashComponent;
  let fixture: ComponentFixture<LinechartdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinechartdashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinechartdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
