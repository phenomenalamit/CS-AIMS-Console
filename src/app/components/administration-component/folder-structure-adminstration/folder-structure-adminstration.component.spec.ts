import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderStructureAdminstrationComponent } from './folder-structure-adminstration.component';

describe('FolderStructureAdminstrationComponent', () => {
  let component: FolderStructureAdminstrationComponent;
  let fixture: ComponentFixture<FolderStructureAdminstrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderStructureAdminstrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderStructureAdminstrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
