import { Component, OnInit ,HostListener } from '@angular/core';
import { UnsplashService } from 'src/app/unsplash.service';
import { saveAs } from 'file-saver/FileSaver';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  constructor(
    private unsplashService: UnsplashService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {
    router.events
    .subscribe((event: NavigationStart) => {
      
      if (event.navigationTrigger === 'popstate') {
        // Perform actions
        if(event.restoredState){
        //  alert("going back" + this.activatedRoute.snapshot.params['id']);
          this.lateFunction();
        }
        console.log("searched for",this.activatedRoute.snapshot.params['id']);
        this.unsplashService.term$.subscribe(a => console.log("terms is ", a))
      }
    });
    console.log("search no pop state for",this.activatedRoute.snapshot.params['id']);

  }
  lateFunction(){
    setTimeout(() => {
      // alert(this.activatedRoute.snapshot.params['id']);
      this.unsplashService.searchTerm(this.activatedRoute.snapshot.params['id']);
    }, 300);
  }
  resp=[];
  p_color: string;
  img_box = false;
  url_author: string;
  tail = '?utm_source=favourites&utm_medium=referral';
  head: string;
  tempTerm:string;
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log("search no pop state for",this.activatedRoute.snapshot.params['id']);

    console.log('Back button pressed',event);
  }
  ngOnInit(): void {
    // alert(this.activatedRoute.snapshot.params['id']);
    // console.log('gallery', this.unsplashService.res);
    // this.unsplashService.resp$.subscribe((a: any) => {
    //   console.log('here a', a);
    //   console.log('here a[0', a[0]);
    //   this.resp = a;
    //   console.log(this.resp);
    // });
   this.unsplashService.term$.subscribe(
    (a)=>{
      this.resp=[];
      console.log("a of term",a);
      this.unsplashService.getPhotos(a.toString()).subscribe(
        (data)=>{
         this.resp.push(data.results);
          this.resp=[...this.resp];
          console.log(this.resp)
          console.log("type of", typeof this.resp);
          
        });
    }
   )
        // this.unsplashService.getPhotos(this.activatedRoute.snapshot.params['id']).subscribe(
        //   (data)=>{
        //     this.resp.push(data.results)
        //     console.log(this.resp)
        //   console.log("type of", typeof this.resp);

        //   }
        // )
      
    
    
    //       if(term != this.activatedRoute.snapshot.params['id']){
    //         this.unsplashService.getPhotos(this.activatedRoute.snapshot.params['id']).subscribe(
    //           (resp:any)=>{
    //             this.resp.push(resp.results);
    //             console.log("data as per snapshot",this.resp);
        
    //             // resp.results.array.forEach(element => {
                  
    //             // });
    //           }
    //         )
    //       }
    //       else{
    //         this.unsplashService.getPhotos(term).subscribe(
    //           (resp:any)=>{
    //             this.resp.push(resp.results);
    //             console.log("data as per search",this.resp);
        
    //             // resp.results.array.forEach(element => {
                  
    //             // });
    //           }
    //         )
    //       }
    //   }
    // )
    
  }
  // ngAfterViewInit(){
  //   this.unsplashService.term$.subscribe(
  //     (a)=>{
  //       console.log("a of term",a);
  //       this.unsplashService.getPhotos(this.activatedRoute.snapshot.params['id']).subscribe(
  //         (data)=>{
  //          this.resp.push(data.results);
  //           this.resp=[this.resp[0],...this.resp];
  //           console.log(this.resp)
  //           console.log("type of", typeof this.resp);
            
  //         });
  //     }
  //   )
  // }

  processColor(c) {
    this.p_color = c.color;
    console.log('color reached', c.color);
    var cc = c.color.substring(1); // strip #
    var rgb = parseInt(cc, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    console.log('luma', luma);
    if (luma > 240) {
      this.p_color = 'rgb(149, 146, 142)';
      console.log('color made', this.p_color);

      // pick a different colour
    }
  }

  info(p) {
    console.log();
    if (this.q != p) {
      this.img_box = false;
      this.q = p;
    }

    this.same(p);

    this.head = p.user.links.html.toString();
    this.url_author = this.head + this.tail;
    console.log('url for author', this.url_author);
    this.img_box = !this.img_box;
    if (this.img_box) {
      this.dlg = false;
    }
  }
  dlg = false;
  q: any;
  same(p) {
    this.q = p;
  }
  dialog(p) {
    if (this.q != p) {
      this.dlg = false;
      this.q = p;
    }
    console.log(this.dlg);
    this.dlg = !this.dlg;
    if (this.dlg) {
      this.img_box = false;
    }
    this.same(p);
  }
  register(p, q) {
    this.download(q, p);
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
  viewFull(p) {
    console.log('inside full view', p);
    this.unsplashService.setFullView(p);
    this.router.navigate(['full-view']);
  }
  download(url, obj) {
    console.log('object in download ', obj);
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (d: any) => {
        console.log('image url data', d);
        // const url = URL.createObjectURL(d);
        if (obj.alt_description != null) {
          saveAs(d, obj.alt_description.toString() + '.jpg');
        } else if (obj.alt_description == null) {
          saveAs(d, 'obj.alt_description.toString()' + '.jpg');
        }
        // URL.revokeObjectURL(url);
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }
}
