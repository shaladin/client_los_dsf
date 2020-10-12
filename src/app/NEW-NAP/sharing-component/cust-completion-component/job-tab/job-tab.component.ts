import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-tab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['./job-tab.component.scss']
})
export class JobTabComponent implements OnInit {

  CustModelCode: string;

  constructor() { }

  ngOnInit() {
    this.CustModelCode = "EMP"
  }

}
