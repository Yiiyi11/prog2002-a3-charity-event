import { TestBed } from '@angular/core/testing';
import { AdminEvent } from './admin-event';

describe('AdminEvent', () => {
  let service: AdminEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEvent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
