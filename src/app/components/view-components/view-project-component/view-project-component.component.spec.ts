import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectComponentComponent } from './view-project-component.component';

describe('ViewProjectComponentComponent', () => {
  let component: ViewProjectComponentComponent;
  let fixture: ComponentFixture<ViewProjectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProjectComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProjectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
