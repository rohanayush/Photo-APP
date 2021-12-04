import { Component } from '@angular/core';
import { UnsplashService } from './unsplash.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { count, map, startWith } from 'rxjs/operators';

import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private photoServices: UnsplashService, private http: HttpClient) {

  }
  p_color: string;
  url: string = "https://playground-trends-backend.herokuapp.com"
  myControl = new FormControl();
  src:string="";
  processColor(c) {
    this.p_color=c.color;
    console.log("color reached",c.color);
    var cc = c.color.substring(1,);      // strip #
    var rgb = parseInt(cc, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >> 8) & 0xff;  // extract green
    var b = (rgb >> 0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    console.log("luma",luma);
    if (luma > 240) {
      this.p_color="rgb(149, 146, 142)";    
    console.log("color made",this.p_color);
      
      // pick a different colour
    }
    

  }
  dlg:boolean=false;
  dialog(p){
    if(this.q != p){
      this.dlg=false;
      this.q=p;
    }
    console.log(this.dlg)
    this.dlg=!this.dlg;
    this.same(p);

  }
  download(url){
    this.http.get(url,{ responseType: 'blob' }).subscribe(
      (d:any)=>{
        console.log("image url data",d);
        // const url = URL.createObjectURL(d);
        saveAs(d, "image.jpg");
      // URL.revokeObjectURL(url);
      },
      (err:any)=>{
        console.log("error",err)
      }
    )
  
  }
  q:any;
  same(p){
    this.q=p; 
  }
  setDialog(){
    this.dlg=false;
  }
  showDetails(adv: any) {
    console.log(adv);
    this.clk = true;
  }
  clk: boolean;
  optionss: string[] = [];

  title = 'photoApp';
  arrQuery = [];
  ngOnInit() {
    // this.photoServices.getPhotos("trees").subscribe((resp: any) => {
    //   this.arrQuery.push(resp.photos.results);
    //   console.log(resp.photos.results);
    // });
  }
  filteredOptions?: Observable<string[]>;
  load:boolean=false;
  msg:boolean=false;
  sg:boolean=true;
  term:string="";
  sg_arr=["Flower","Music","Greetings","Cars","Cute",
  "Animals","Wallpaper","Cartoons","Nature","Retro",
  "Games"]
  hideSuggestions(){
    this.sg =!this.sg;
  }
  closeMsg(){
    this.msg=false;
  }
  setWallpaper(p){
    this.src=p;

  }
  search(value) {
    console.log(value,"checking value received on search")
    if(typeof(value) === 'undefined'){
      this.msg=true;
      console.log("Reached inside null and value of msg is:",this.msg)

    }
    else if(typeof(value) != 'undefined'){
      this.term =value;
      this.sg=false;
    this.arrQuery = [];
    this.load=true;

    this.photoServices.getPhotos(value).subscribe(
      (resp: any) => {
      console.log("resp",resp)
      this.load=false;

      this.arrQuery.push(resp.results);
      console.log("results",resp.results);
    },
    (err:any)=>{
  this.load=false;

      console.log("error in search",err);
      alert("Please search for something else like flower,flowerpot,rivers (photography terms) as the unsplash server is unable to find any image for your search. App is in early stage phase. Thank you for reaching out :)");
    });
  }
}
  val: string;
  sendValue(value: any) {
    // this.arrQuery = [];

    console.log("value", value)

    this.http.post(this.url + "/suggest", value).subscribe(
      (data: any) => {
        console.log(data);
        this.setData(data);


      },
      error => {
        console.log("error", error)
      }
    )
    // this.setData(value);
    // this.search(value);


  }
  key:string="apJcuP6-W8CWpsM4a3LiI8XPsFEB4NSDV9bsBwgSwO0";
  tail="?utm_source=favourites&utm_medium=referral"
  head:string;
  url_author:string;
  g="https://google.co.in";
  img_box=false;
  qq:any;

 info(p){

   console.log();
   if(this.q != p)
   {
    this.img_box=false;
    this.q=p;
  }

   this.same(p);


   this.head=p.user.links.html.toString();
   this.url_author= this.head+this.tail;
   console.log("url for author",this.url_author)
   this.img_box=!this.img_box;

 }


  register(p,q){
this.photoServices.register_download(p).subscribe(
(  data:any)=>{
  console.log("some data",data);
  this.download(q);
},
(err:any)=>{
  console.log("error in registering",err);
}
)
  }


  search1() {
    this.search(this.val);
    localStorage.setItem("token",this.val);
  }

  ddd: any[] = [];
  setData(d: any) {
    var dd = d;
    this.ddd = []
    for (var i in dd) {
      this.ddd.push(dd[i].title);
    }
    console.log("ddd", this.ddd);
    this.optionss = this.ddd;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    console.log("options:", this.optionss);
    console.log("flterred options:", this.filteredOptions);
  }

  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionss.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


  onScroll() { 
    if (this.val && this.val.length > 0) {
      this.photoServices.getPhotos(this.val).subscribe(
        (data:any)=>{
          this.arrQuery.push(data.results);
        },
        (error:any)=>{
        }
      )
    }
  }


}


