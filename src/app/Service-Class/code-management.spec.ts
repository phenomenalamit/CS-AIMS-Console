import { TestBed } from '@angular/core/testing';

import { CodeManagement } from './code-management';

describe('CodeManagement', () => {
  let service: CodeManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
