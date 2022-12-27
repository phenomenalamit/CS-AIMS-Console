import { TestBed } from '@angular/core/testing';

import { LanguagemasterService } from './languagemaster.service';

describe('LanguagemasterService', () => {
  let service: LanguagemasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguagemasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
