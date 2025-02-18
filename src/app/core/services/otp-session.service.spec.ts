import { TestBed } from '@angular/core/testing';

import { OtpSessionService } from './otp-session.service';

describe('OtpSessionService', () => {
  let service: OtpSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtpSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
