import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableServiceService {
  state=new BehaviorSubject(false)
  constructor() { }
}
