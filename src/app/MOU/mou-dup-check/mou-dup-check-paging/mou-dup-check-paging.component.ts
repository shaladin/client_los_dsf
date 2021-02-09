import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-dup-check-paging',
  templateUrl: './mou-dup-check-paging.component.html',
  styleUrls: ['./mou-dup-check-paging.component.scss']
})
export class MouDupCheckPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor(
    private http: HttpClient,
    private router: Router, private cookieService: CookieService
  ) {
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouDupCheck.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouDupCheck.json";
  }

  NextScreen(event) {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: event.RowObj.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });

    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == false) {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/DuplicateCheck/SimilarPersonal"], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": event.RowObj.WfTaskListId });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == true) {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/DuplicateCheck/ExistingPersonal"], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": event.RowObj.WfTaskListId });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == false) {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/DuplicateCheck/SimilarCompany"], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": event.RowObj.WfTaskListId });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == true) {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/DuplicateCheck/ExistingCompany"], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": event.RowObj.WfTaskListId });
    }
  }
}
