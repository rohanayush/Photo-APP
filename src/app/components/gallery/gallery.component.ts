import { Component, OnInit, HostListener } from '@angular/core';
import { UnsplashService } from 'src/app/unsplash.service';
import { saveAs } from 'file-saver/FileSaver';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute
  ) {
    router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        // Perform actions
        if (event.restoredState) {
          //  alert("going back" + this.activatedRoute.snapshot.params['id']);
          this.lateFunction();
        }
        //console.log('searched for', this.activatedRoute.snapshot.params['id']);
       
      }
    });
   
  }

  lateFunction() {
    var previous = this.activatedRoute.snapshot.params['id'];
    setTimeout(() => {
      if (
        (this.activatedRoute.snapshot.params['id'] != undefined ||
          this.activatedRoute.snapshot.params['id'] != 'search') &&
        this.activatedRoute.snapshot.params['id'] != previous
      ) {
        this.unsplashService.searchTerm(
          this.activatedRoute.snapshot.params['id']
        );
      } else if (this.activatedRoute.snapshot.params['id'] == previous) {
        //console.log('term not changed');
      }
    }, 1000);
  }

  resp = [];
  p_color: string;
  img_box = false;
  url_author: string;
  tail = '?utm_source=favourites&utm_medium=referral';
  head: string;
  tempTerm: string;
 
  ngOnInit(): void {

    this.activatedRoute.params.subscribe( (params:any) => {
      console.log("\n\n params: |n\n", params.id);
      this.resp=[];
      const a = params.id;
      this.unsplashService.getPhotos(a.toString()).subscribe((data) => {
        this.resp.push(data.results);
        // alert("results if any"+ JSON.stringify(this.resp))
        // this.resp = [...this.resp];
      });
    });

   
  }
  fullView(photo:any){
    // alert(JSON.stringify(photo));
    this.unsplashService.setFullView(photo);
  }


  processColor(c) {
    this.p_color = c.color;
    var cc = c.color.substring(1); // strip #
    var rgb = parseInt(cc, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    //console.log('luma', luma);
    if (luma > 240) {
      this.p_color = 'rgb(149, 146, 142)';
      // //console.log('color made', this.p_color);

      // pick a different colour
    }
  }

  info(p) {
    // //console.log();
    if (this.q != p) {
      this.img_box = false;
      this.q = p;
    }

    this.same(p);

    this.head = p.user.links.html.toString();
    this.url_author = this.head + this.tail;
    // //console.log('url for author', this.url_author);
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
    // //console.log(this.dlg);
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
    //   //console.log("some data",data);
    //   this.download(q,p);
    // },
    // (err:any)=>{
    //   //console.log("error in registering",err);
    // }
    // )
  }
  viewFull(p) {
    // //console.log('inside full view', p);
    this.unsplashService.setFullView(p);
    this.router.navigate(['full-view']);
  }
  download(url, obj) {
    // //console.log('object in download ', obj);
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (d: any) => {
        // //console.log('image url data', d);
        // const url = URL.createObjectURL(d);
        if (obj.alt_description != null) {
          saveAs(d, obj.alt_description.toString() + '.jpg');
        } else if (obj.alt_description == null) {
          saveAs(d, 'obj.alt_description.toString()' + '.jpg');
        }
        // URL.revokeObjectURL(url);
      },
      (err: any) => {
        // //console.log('error', err);
      }
    );
  }
}
