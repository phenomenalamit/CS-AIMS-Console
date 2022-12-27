import { TestBed } from '@angular/core/testing';

import { ProjectSituationService } from './project-situation.service';

describe('ProjectSituationService', () => {
  let service: ProjectSituationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSituationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
