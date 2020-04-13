import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-agr-main-info',
  templateUrl: './agr-main-info.component.html',
  styleUrls: ['./agr-main-info.component.scss']
})
export class AgrMainInfoComponent implements OnInit {

  viewObj: string;
  @Input() arrValue = [];
  constructor() { }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfo.json";
  }

}