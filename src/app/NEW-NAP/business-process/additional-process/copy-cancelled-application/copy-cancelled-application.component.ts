import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcgridviewComponent } from '@adins/ucgridview';
import { UcpagingComponent } from '@adins/ucpaging';

@Component({
  selector: 'app-copy-cancelled-application',
  templateUrl: './copy-cancelled-application.component.html',
  styleUrls: ['./copy-cancelled-application.component.scss']
})
export class CopyCancelledApplicationComponent implements OnInit {
  @ViewChild(UcpagingComponent) paging: UcpagingComponent;
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCancelledApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCancelledApp.json";
  }

  CopyCancelled(ev) {
    if (confirm("Are you sure to copy this application?")) {
      this.paging.searchPagination(1);
      console.log(ev);
    }
  }
}
