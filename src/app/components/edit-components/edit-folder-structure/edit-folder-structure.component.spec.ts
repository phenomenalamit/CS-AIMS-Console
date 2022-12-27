import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFolderStructureComponent } from './edit-folder-structure.component';

describe('EditFolderStructureComponent', () => {
  let component: EditFolderStructureComponent;
  let fixture: ComponentFixture<EditFolderStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFolderStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFolderStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
