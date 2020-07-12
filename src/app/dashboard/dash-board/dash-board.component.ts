import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '@progress/kendo-angular-menu';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

declare var require: any;

const data: any = require('../../shared/data/chartist.json');
export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: []
})
export class DashBoardComponent implements OnInit {
  Item: any;

  username: string;
  url: string;
  officeCode: string;
  roleCode: string;

  constructor() { }

  ngOnInit() {
    let context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.username = context[CommonConstant.USER_NAME];
    this.url = environment.DashboardURL;
    this.officeCode = context[CommonConstant.OFFICE_CODE];
    this.roleCode = context[CommonConstant.ROLE_CODE];
    this.Item = { Url: environment.FoundationR3Url + "/ThingsToDo/GetThingsToDoByRole", Module: CommonConstant.LOAN_ORIGINATION };
  }
}
