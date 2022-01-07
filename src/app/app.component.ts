import { Component ,HostListener} from '@angular/core';
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
  // load=true;
  constructor(private photoServices: UnsplashService, private http: HttpClient) {
            for(var i=0;i<this.sg_arr.length;i++){
              var a={}
              
               
              a["name"]=this.sg_arr[i];
              a["resp"]="https://source.unsplash.com/random/700x700/?"+this.sg_arr[i];
              this.sg_arr1.push(a);
            }
            console.log("aray",this.sg_arr1);
            this.sg_dup=this.sg_arr;

  }
  sg_arr1=[];
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
  val1="🕵️"
  clear(){
    this.arrQuery=[];
    this.hideSuggestions();
    this.val1="";
    this.sg_arr=this.sg_dup;
  }
  dlg:boolean=false;
  dialog(p){
    if(this.q != p){
      this.dlg=false;
      this.q=p;
    }
    console.log(this.dlg)
    this.dlg=!this.dlg;
    if(this.dlg){
      this.img_box =false;
    }
    this.same(p);

  }
  download(url,obj){
    console.log("object in download ",obj);
    this.http.get(url,{ responseType: 'blob' }).subscribe(
      (d:any)=>{
        console.log("image url data",d);
        // const url = URL.createObjectURL(d);
        if(obj.alt_description!= null){
        saveAs(d, obj.alt_description.toString()+".jpg");
        }
        else if(obj.alt_description == null){
          saveAs(d, "obj.alt_description.toString()"+".jpg");
          }
      // URL.revokeObjectURL(url);
      },
      (err:any)=>{
        console.log("error",err)
      }
    )
  
  }
  // load:boolean=false;
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
  showSuggestions(){
    this.sg=true;
    this.explorer=true;
  }
  Suggestions(){
    this.sg=!this.sg;
    this.explorer=!this.explorer;
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
  // load:boolean=false;
  msg:boolean=false;
  sg:boolean=true;
  term:string="";
  
  sg_arr=["Flower","Music","Greetings","Cars","Cute",
  "Animals","Wallpaper","Cartoons","Nature",
  "Games"]

  hideSuggestions(){
    this.sg =false;
    this.explorer=false;
    this.load=false;
  }
  closeMsg(){
    this.msg=false;
  }
  setWallpaper(p){
    this.src=p;
    console.log("selected to be background",this.src);

  }
  load:boolean;
  search(value) {
    this.clear();
    this.val1=value;
    this.present=true;

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
  recommendValue() {
    // this.arrQuery = [];
   if(this.val1){
    console.log("value", this.val)

    this.http.post(this.url + "/suggest", this.val1).subscribe(
      (data: any) => {
        console.log(data);
        this.recData(data);
        this.Suggestions();

      },
      error => {
        console.log("error", error)
      }
    )
   }
   else{
    //  alert("value not set");
     this.Suggestions();
   }
    // this.setData(value);
    // this.search(value);


  }
  sg_dup=[]
  recData(data){
    this.sg_arr=[];
    for (var i=0; i < data.length; i++){
      this.sg_arr.push(data[i].title)
    }
    console.log("in rec data sg_arr",this.sg_arr)
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
   if(this.img_box){
     this.dlg=false;
   }

 }


  register(p,q){
    this.download(q,p);
// this.photoServices.register_download(p).subscribe(
// (  data:any)=>{
//   console.log("some data",data);
//   this.download(q,p);
// },
// (err:any)=>{
//   console.log("error in registering",err);
// }
// )
  }
  explorer=true;

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

present=false;
presen(){
   this.present=false;
}
presen1(){
  this.present=true;
}
offsetFlag:boolean=false;

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


