import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalProjectComponent } from './view-table-modal-project.component';

describe('ViewTableModalProjectComponent', () => {
  let component: ViewTableModalProjectComponent;
  let fixture: ComponentFixture<ViewTableModalProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
