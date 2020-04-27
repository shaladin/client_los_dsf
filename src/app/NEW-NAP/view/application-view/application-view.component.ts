import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class applicationViewComponent implements OnInit {

  constructor() { }

  AppId;
  ngOnInit() {
    this.AppId = 31;
  }

}
