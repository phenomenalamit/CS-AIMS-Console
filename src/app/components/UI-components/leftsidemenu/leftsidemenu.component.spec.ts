import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftsidemenuComponent } from './leftsidemenu.component';

describe('LeftsidemenuComponent', () => {
  let component: LeftsidemenuComponent;
  let fixture: ComponentFixture<LeftsidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftsidemenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftsidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
