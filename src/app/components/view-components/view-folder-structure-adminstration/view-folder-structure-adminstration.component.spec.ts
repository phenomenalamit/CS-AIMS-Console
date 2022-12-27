import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFolderStructureAdminstrationComponent } from './view-folder-structure-adminstration.component';

describe('ViewFolderStructureAdminstrationComponent', () => {
  let component: ViewFolderStructureAdminstrationComponent;
  let fixture: ComponentFixture<ViewFolderStructureAdminstrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFolderStructureAdminstrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFolderStructureAdminstrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
