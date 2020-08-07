import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-dup-check-paging',
  templateUrl: './mou-dup-check-paging.component.html',
  styleUrls: ['./mou-dup-check-paging.component.scss']
})
export class MouDupCheckPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheck.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheck.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

  NextScreen(event) {
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == false) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == true) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == false) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Company"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == true) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
  }
}
