import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  prevKeyword: string;
  currPage = 1;
   
  //key
  key:string="apJcuP6-W8CWpsM4a3LiI8XPsFEB4NSDV9bsBwgSwO0";
  base_url:string="https://api.unsplash.com/search/photos?";
  one_photoUrl:string="https://api.unsplash.com/photos/random/?"
  per_page:string="20";
  page:string="1";
  query:string="flowers";
  oneUrl:string="https://source.unsplash.com/random/?"
  resp$ = new BehaviorSubject(1);
  res:any;
  fullView$ = new BehaviorSubject(1);
  constructor(private http:HttpClient) { 
    
  }
  // Full view
  setFullView(p){
  this.fullView$.next(p);
  }

  //Setting response
  setResponse(value:any){
    this.res=value;
    this.resp$.next(value);

    console.log("received from component", this.res);
  }
  // Get Pictures
  getPhotos(q:string):Observable<any> {
    if (this.prevKeyword != q) {
      this.currPage = 1;
    } 
    
    else if (this.prevKeyword === q) {
      this.currPage++;

    }
    this.prevKeyword = q;
    
    return this.http.get<any>(`${this.base_url}
                                  page=${this.currPage}
                                  &per_page=${this.per_page}
                                  &query=${q}
                                  &utm_source=favourites&utm_medium=referral&client_id=${this.key}`);
  }
  register_download(p){
    return this.http.get<any>(`${p.links.download_location}&client_id=${this.key}`);

  }
  getOnePhoto(q):Observable<any>{
    return this.http.get<any>(`${this.one_photoUrl}${q}&client_id=${this.key}`);
  }
}
