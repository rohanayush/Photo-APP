import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnsplashService } from 'src/app/unsplash.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  val: String;
  msg: Boolean;
  val1 = '🕵️';
  filteredOptions?: Observable<string[]>;
  // load:boolean=false;
  sg: boolean = true;
  term: string = '';
  clk: boolean;
  optionss: string[] = [];

  title = 'photoWizard';
  arrQuery = [];
  url: string = 'https://playground-trends-backend.herokuapp.com';
  load = false;
  myControl = new FormControl();
  ddd: any[] = [];

  sg_arr = [
    'Flower',
    'Music',
    'Greetings',
    'Cars',
    'Cute',
    'Animals',
    'Wallpaper',
    'Cartoons',
    'Nature',
    'Retro',
    'Games',
  ];

  constructor(
    private photoServices: UnsplashService,
    private http: HttpClient,
    private router: Router,

    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //console.log("router value",this.activatedRoute.snapshot.params['id'])
    if (this.activatedRoute.snapshot.params['id'] == undefined) {
      //console.log("caught in search")
    }
  }

  search(value) {
    // this.clear();
    this.val1 = value;
    // this.present=true;

    //console.log(value, 'checking value received on search');
    if (typeof value === 'undefined') {
      this.msg = true;
      //console.log('Reached inside null and value of msg is:', this.msg);
    } else if (typeof value != 'undefined') {
      
      // this.photoServices.searchTerm(value);
      this.router.navigate(['gallery/' + value]);
    }
  }

  sendValue(value: any) {
    // this.arrQuery = [];

    //console.log('value', value);

    this.http.post(this.url + '/suggest', value).subscribe(
      (data: any) => {
        //console.log(data);
        this.setData(data);
      },
      (error) => {
        //console.log('error', error);
      }
    );
    // this.setData(value);
    // this.search(value);
  }
  clear() {
    this.arrQuery = [];
    // this.hideSuggestions();
    this.val1 = '🕵️';
  }
  setData(d: any) {
    var dd = d;
    this.ddd = [];
    for (var i in dd) {
      this.ddd.push(dd[i].title);
    }
    //console.log('ddd', this.ddd);
    this.optionss = this.ddd;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    //console.log('options:', this.optionss);
    //console.log('flterred options:', this.filteredOptions);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionss.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
