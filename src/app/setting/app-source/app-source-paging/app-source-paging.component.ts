import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-source-paging',
  templateUrl: './app-source-paging.component.html'
})
export class AppSourcePagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private router: Router) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppSource.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppSource.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: 'RAS.MR_APP_SRC_TYPE_CODE',
        environment: environment.FoundationR3Url,
      }
    ]
  }

  AddClick() {
    AdInsHelper.RedirectUrl(this.router, ["/Setting/AppSource/Detail"], { "mode": "Add" })
  }
}
