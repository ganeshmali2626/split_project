import { TestBed } from '@angular/core/testing';

import { HederInterceptorInterceptor } from './heder-interceptor.interceptor';

describe('HederInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HederInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HederInterceptorInterceptor = TestBed.inject(HederInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
