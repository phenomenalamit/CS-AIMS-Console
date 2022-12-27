import { TestBed } from '@angular/core/testing';

import { ListOfAssociatedFundingService } from './list-of-associated-funding.service';

describe('ListOfAssociatedFundingService', () => {
  let service: ListOfAssociatedFundingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListOfAssociatedFundingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
