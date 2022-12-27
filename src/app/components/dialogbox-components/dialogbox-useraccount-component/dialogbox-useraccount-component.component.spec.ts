import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogboxUseraccountComponentComponent } from './dialogbox-useraccount-component.component';

describe('DialogboxUseraccountComponentComponent', () => {
  let component: DialogboxUseraccountComponentComponent;
  let fixture: ComponentFixture<DialogboxUseraccountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogboxUseraccountComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogboxUseraccountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
