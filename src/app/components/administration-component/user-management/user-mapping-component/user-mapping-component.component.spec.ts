import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMappingComponentComponent } from './user-mapping-component.component';

describe('UserMappingComponentComponent', () => {
  let component: UserMappingComponentComponent;
  let fixture: ComponentFixture<UserMappingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMappingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMappingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
