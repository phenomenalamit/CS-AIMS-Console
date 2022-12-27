import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMozgisProjectComponent } from './delete-mozgis-project.component';

describe('DeleteMozgisProjectComponent', () => {
  let component: DeleteMozgisProjectComponent;
  let fixture: ComponentFixture<DeleteMozgisProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMozgisProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMozgisProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
