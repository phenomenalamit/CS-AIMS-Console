import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectComponentComponent } from './add-project-component.component';

describe('AddProjectComponentComponent', () => {
  let component: AddProjectComponentComponent;
  let fixture: ComponentFixture<AddProjectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
