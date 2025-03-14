import { TestBed } from '@angular/core/testing';

import { DemoCreditService } from './demo-credit.service';

describe('DemoCreditService', () => {
  let service: DemoCreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoCreditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
