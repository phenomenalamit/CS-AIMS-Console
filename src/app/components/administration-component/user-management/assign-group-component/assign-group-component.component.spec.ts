import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupComponentComponent } from './assign-group-component.component';

describe('AssignGroupComponentComponent', () => {
  let component: AssignGroupComponentComponent;
  let fixture: ComponentFixture<AssignGroupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignGroupComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGroupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
