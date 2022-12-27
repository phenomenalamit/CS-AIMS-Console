import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableModalUserAccountComponent } from './view-table-modal-user-account.component';

describe('ViewTableModalUserAccountComponent', () => {
  let component: ViewTableModalUserAccountComponent;
  let fixture: ComponentFixture<ViewTableModalUserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableModalUserAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableModalUserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
