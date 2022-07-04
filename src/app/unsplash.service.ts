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
  prevKeyword: string;
  currPage = 50;
   
  //key
  key:string="your key";
  base_url:string="https://api.unsplash.com/search/photos?";
  one_photoUrl:string="https://api.unsplash.com/photos/random/?"
  per_page:string="100";
  page:string="1";
  query:string="flowers";
  oneUrl:string="https://source.unsplash.com/random/?"

  constructor(private http:HttpClient) { 
    
  }

  // Get Pictures
  getPhotos(q:string):Observable<any> {
    
    
    return this.http.get<any>(`${this.base_url}
                           
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
