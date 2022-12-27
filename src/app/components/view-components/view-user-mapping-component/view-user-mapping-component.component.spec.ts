import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserMappingComponentComponent } from './view-user-mapping-component.component';

describe('ViewUserMappingComponentComponent', () => {
  let component: ViewUserMappingComponentComponent;
  let fixture: ComponentFixture<ViewUserMappingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserMappingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserMappingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
