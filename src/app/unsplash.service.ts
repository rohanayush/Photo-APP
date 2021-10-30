import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
   
  //key
  key:string="apJcuP6-W8CWpsM4a3LiI8XPsFEB4NSDV9bsBwgSwO0";
  base_url:string="https://api.unsplash.com/search?";
  per_page:string="20";
  page:string="1";
  query:string="flowers";

  constructor(private http:HttpClient) { }

  // Get Pictures
  getPhotos(q):Observable<any> {
    return this.http.get<any>(`${this.base_url}page=${this.page}&per_page=${this.per_page}&query=${q}&client_id=${this.key}`);
  }
}
