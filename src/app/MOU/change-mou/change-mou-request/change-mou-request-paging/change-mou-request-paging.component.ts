import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { environment } from "environments/environment";
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { Router } from "@angular/router";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";

@Component({
  selector: "app-change-mou-request-paging",
  templateUrl: "./change-mou-request-paging.component.html"
})

export class ChangeMouRequestPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private AdInsHelperService: AdInsHelperService
  ) {}

  ngOnInit() {
    this.inputPagingObj._url =
      "./assets/ucpaging/mou/searchChangeMouRequest.json";
    this.inputPagingObj.pagingJson =
      "./assets/ucpaging/mou/searchChangeMouRequest.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1",
      },
    ];
  }

  GetCallBack(ev: any) {
    if (ev.Key == "edit") {
      var obj = { Id: ev.RowObj["MouCustId"] };
      this.http
        .post(URLConstant.CheckMouCustInChangeMouProcess, obj)
        .subscribe((response) => {
          if (response["Status"] == "Success") {
            this.toastr.errorMessage("MOU is in another process");
            return;
          } else {
            AdInsHelper.RedirectUrl(
              this.router,
              [
                NavigationConstant.CHANGE_MOU_REQ_DETAIL
              ],
              { MouCustId: ev.RowObj["MouCustId"] }
            );
          }
        });
    }else if(ev.Key == "ViewCust"){
      var custObj = { CustNo: ev.RowObj["CustNo"] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );

    }
  }
}
