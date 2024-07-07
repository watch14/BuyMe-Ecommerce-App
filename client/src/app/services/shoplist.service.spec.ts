import { TestBed } from '@angular/core/testing';

import { ShoplistService } from './shoplist.service';

describe('ShoplistService', () => {
  let service: ShoplistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoplistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
