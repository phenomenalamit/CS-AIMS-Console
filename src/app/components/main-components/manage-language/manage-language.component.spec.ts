import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLanguageComponent } from './manage-language.component';

describe('ManageLanguageDetailsComponent', () => {
  let component: ManageLanguageComponent;
  let fixture: ComponentFixture<ManageLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLanguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
