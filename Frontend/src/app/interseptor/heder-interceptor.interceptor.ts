import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HederInterceptorInterceptor implements HttpInterceptor {



  constructor(private rout:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    

    let req:any;
     req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('login')!
            )}`,
          }
        });



    return next.handle(req);
  }
  }

