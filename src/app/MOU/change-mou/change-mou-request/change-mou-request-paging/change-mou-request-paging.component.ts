import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { environment } from "environments/environment";
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationConstant } from "app/shared/constant/NavigationConstant";

@Component({
  selector: "app-change-mou-request-paging",
  templateUrl: "./change-mou-request-paging.component.html"
})

export class ChangeMouRequestPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.inputPagingObj._url =
      "./assets/ucpaging/mou/searchChangeMouRequest.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson =
      "./assets/ucpaging/mou/searchChangeMouRequest.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url,
      },
    ];
  }

  GetCallBack(ev: any) {
    if (ev.Key == "edit") {
      var obj = { MouCustId: ev.RowObj["MouCustId"] };
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
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );

    }
  }
}
