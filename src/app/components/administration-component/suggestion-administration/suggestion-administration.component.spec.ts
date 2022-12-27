import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionAdministrationComponent } from './suggestion-administration.component';

describe('SuggestionAdministrationComponent', () => {
  let component: SuggestionAdministrationComponent;
  let fixture: ComponentFixture<SuggestionAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestionAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
