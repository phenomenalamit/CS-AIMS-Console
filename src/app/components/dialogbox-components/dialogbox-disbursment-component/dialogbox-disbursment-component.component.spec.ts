import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogboxDisbursmentComponentComponent } from './dialogbox-disbursment-component.component';

describe('DialogboxDisbursmentComponentComponent', () => {
  let component: DialogboxDisbursmentComponentComponent;
  let fixture: ComponentFixture<DialogboxDisbursmentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogboxDisbursmentComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogboxDisbursmentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
