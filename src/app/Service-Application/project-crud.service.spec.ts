import { TestBed } from '@angular/core/testing';

import { ProjectCrudService } from './project-crud.service';

describe('ProjectCrudService', () => {
  let service: ProjectCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
