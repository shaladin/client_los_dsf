import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { Router } from '@angular/router';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-app-source-paging-x',
  templateUrl: './app-source-paging-x.component.html'
})
export class AppSourcePagingXComponent implements OnInit {
 
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private router: Router) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/impl/ucpaging/searchAppSourceX.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchAppSourceX.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: 'RAS.MR_APP_SRC_TYPE_CODE',
        environment: environment.FoundationR3Url + "/v1",
      }
    ]
  }

  AddClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SETTING_APP_SOURCE_DETAIL_X], { "mode": "Add" })
  }
}