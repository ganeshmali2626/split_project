import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private count = 0;
  spinner$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  getSpinnerObserver(): Observable<boolean> {
    return this.spinner$.asObservable();
  }

  requestStarted() {
    if (++this.count === 1) {
      this.spinner$.next(true);
      console.log('abc');
    }
  }

  requestEnded() {
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next(false);
    }
  }

  resetSpinner() {
    this.count = 0;
    this.spinner$.next(false);
  }
}
