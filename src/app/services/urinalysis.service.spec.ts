import { TestBed } from '@angular/core/testing';

import { UrinalysisService } from './urinalysis.service';

describe('UrinalysisService', () => {
  let service: UrinalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrinalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
