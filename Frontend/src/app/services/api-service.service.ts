import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:4000';

  postData(finalUrl: string, data: any) {
    return this.http.post(this.baseUrl + finalUrl, data);
  }
  getData(finalUrl: string) {

    return this.http.get(this.baseUrl + finalUrl);
  }
  patchData(finalUrl:any,data:any) {
    return this.http.patch(this.baseUrl + finalUrl, data);
  }
  // deleteData(finalUrl:any) {
  //   return this.http.delete(this.baseUrl + finalUrl);
  // }
  putData(finalUrl: string, data: any) {
    return this.http.put(this.baseUrl + finalUrl, data)

  }

  chekstorage()
  {
    return localStorage.getItem('login')!=null;
  }
}
