import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html',
  styleUrls: ['./app-main-info.component.scss']
})
export class AppMainInfoComponent implements OnInit {

  viewObj: string;
  @Input() arrValue = [];
  constructor() { }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewAppMainInfo.json";
  }

}
