import { TestBed } from '@angular/core/testing';

import { BankOfMozambiqueService } from './bank-of-mozambique.service';

describe('BankOfMozambiqueService', () => {
  let service: BankOfMozambiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankOfMozambiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
