import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-app-paging',
  templateUrl: './app-paging.component.html'
})
export class AppPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  readonly AddFreeLink: string = NavigationConstant.CF2W_ADD_FREE;
  readonly AddFixedLink: string = NavigationConstant.CF2W_ADD_FIXED;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";
  }
}
