import { Component, OnInit } from '@angular/core';
import { UnsplashService } from 'src/app/unsplash.service';

@Component({
  selector: 'app-picture-view',
  templateUrl: './picture-view.component.html',
  styleUrls: ['./picture-view.component.css'],
})
export class PictureViewComponent implements OnInit {
  picture: any;
  constructor(private unsplashService: UnsplashService) {}

  ngOnInit(): void {
    this.unsplashService.fullView$.subscribe((a: any) => {
      this.picture = a;
      console.log("picture ",this.picture);
      
    });

  }
}
