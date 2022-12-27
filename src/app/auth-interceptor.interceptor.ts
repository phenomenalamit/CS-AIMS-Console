import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = "Bearer " +localStorage.getItem('token');
    
    if (request.headers.get("skip")) {
      console.log("header skiped");
      return next.handle(request);
    }else if(request.url.startsWith('http://dev.mozgis.gov.mz:21037/api/Integration/')){
      request = request.clone({
        setHeaders: {
          Authorization: "Basic " + btoa("admin:123qwe")
        }
      });
      console.log('mozgis api request');
      return next.handle(request);
    }
     else {
      request = request.clone({
        setHeaders: {
          Authorization: token
        }
      });
      return next.handle(request);
    }
  }
}
