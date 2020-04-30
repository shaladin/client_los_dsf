import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nap-view',
  templateUrl: './nap-view.component.html',
  styles: []
})
export class NapViewComponent implements OnInit {
  arrValue = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    
  }

}
