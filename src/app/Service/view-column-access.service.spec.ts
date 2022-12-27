import { TestBed } from '@angular/core/testing';

import { ViewColumnAccessService } from './view-column-access.service';

describe('ViewColumnAccessService', () => {
  let service: ViewColumnAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewColumnAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
