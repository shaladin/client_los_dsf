import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {
  AppId: number;
  arrValue = [];
  
  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
  }


}
