import { TestBed } from '@angular/core/testing';

import { QuerysService } from './querys.service';

describe('QuerysService', () => {
  let service: QuerysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuerysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
