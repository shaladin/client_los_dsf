import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-agrmnt',
  templateUrl: './view-agrmnt.component.html' 
})
export class ViewAgrmntComponent implements OnInit {

  constructor(private route : ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
    });
   }
  viewAgrMainInfo : string;
  AgrmntId : number;
  ngOnInit() {
    this.viewAgrMainInfo = "./assets/ucviewgeneric/viewAgrMainInfo.json";
  }

}
