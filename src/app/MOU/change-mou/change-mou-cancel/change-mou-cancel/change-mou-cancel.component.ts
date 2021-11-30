import { Component, OnInit } from "@angular/core";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ChangeMouCustConfirmCancelObj } from "app/shared/model/change-mou-cust-confirm-cancel-obj.model";
import { CurrentUserContext } from "app/shared/model/current-user-context.model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { CookieService } from "ngx-cookie";
import { RequestTaskModelObj } from "app/shared/model/workflow/v2/request-task-model-obj.model";
import { IntegrationObj } from "app/shared/model/library/integration-obj.model";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";

@Component({
  selector: "app-change-mou-cancel",
  templateUrl: "./change-mou-cancel.component.html",
  styleUrls: [],
})
export class ChangeMouCancelComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj : IntegrationObj = new IntegrationObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private adInsHelperService: AdInsHelperService
  ) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouCancel.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouCancel.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MC.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1",
      },
      {
        name: "CMT.STATUS",
        environment: environment.FoundationR3Url + "/v1",
      },
    ];

    if(environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/mou/V2/searchChangeMouCancelV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/V2/searchChangeMouCancelV2.json";
    }
  }

  getEvent(event) {
    if (event.Key == "customer") {
      let CustNoObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    } else if (event.Key == "cancel") {
      if (confirm("Are you sure to cancel this?")) {
        var mouCancel = new ChangeMouCustConfirmCancelObj();
        let urlPost = environment.isCore ? URLConstant.EditChangeMouForCancelByChangeMouTrxIdV2 : URLConstant.EditChangeMouForCancelByChangeMouTrxId;

        mouCancel.Status = CommonConstant.MouStatCancel;
        mouCancel.ChangeMouTrxId = event.RowObj.ChangeMouTrxId;
        mouCancel.TrxNo = event.RowObj.TrxNo;
        mouCancel.WfTaskListId = environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId;
        mouCancel.RowVersion = event.RowObj.RowVersions;
        this.http
          .post(urlPost, mouCancel)
          .subscribe((response) => {
            this.toastr.successMessage(response["Message"]);
            this.router
              .navigateByUrl("/", { skipLocationChange: true })
              .then(() => {
                this.router.navigate([NavigationConstant.CHANGE_MOU_CANCEL]);
              });
          });
      }
    }
  }
}
