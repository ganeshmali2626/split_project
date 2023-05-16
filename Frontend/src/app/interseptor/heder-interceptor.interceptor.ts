import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class HederInterceptorInterceptor implements HttpInterceptor {



  constructor(private rout:Router,private spinner:SpinnerService) {}

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


  //   let req:any;
  //    req = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${JSON.parse(
  //           localStorage.getItem('login')!
  //           )}`,
  //         }
  //       });



  //   return this.handler(next,request)
  // }
  // // handle()
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('login')!)}`,
      }
    });
    console.log("start");

    this.spinner.requestStarted();
    return this.handler(next, modifiedRequest);
  }

    handler(next: HttpHandler, request: HttpRequest<any>): Observable<HttpEvent<any>> {
    // Implement your custom logic here
    // You can perform any pre or post-processing of the request or response
    // You can also modify the request or handle errors

    // For example, let's log the request URL before passing it to the next handler
    console.log('Request URL:', request.url);

    // Call the next handler and return its result
    return next.handle(request)
    .pipe(
      tap(
        (event: any) =>{
          if(event instanceof HttpResponse){
            console.log("end");

            this.spinner.requestEnded();
          }
        },
        (error:HttpErrorResponse)=>{
          console.log("reset");

          this.spinner.resetSpinner();
        }
      ),
    );
  }
}

