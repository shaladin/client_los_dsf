import { Component, OnInit } from "@angular/core";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ChangeMouCustConfirmCancelObj } from "app/shared/model/ChangeMouCustConfirmCancelObj.Model";
import { CurrentUserContext } from "app/shared/model/CurrentUserContext.model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { CookieService } from "ngx-cookie";
import { RequestTaskModelObj } from "app/shared/model/Workflow/V2/RequestTaskModelObj.model";
import { IntegrationObj } from "app/shared/model/library/IntegrationObj.model";

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
    private cookieService: CookieService
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
      this.inputPagingObj.isJoinExAPI = true;
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CHANGE_MOU;
      this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE];
      this.RequestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE];
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "TrxNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  getEvent(event) {
    let custId: number;
    let mrCustTypeCode: string;
    if (event.Key == "customer") {
      let CustNoObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          custId = response['CustId'];
          mrCustTypeCode = response['MrCustTypeCode'];

          if (mrCustTypeCode == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(custId);
          }

          if (mrCustTypeCode == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(custId);
          }
        });
    } else if (event.Key == "cancel") {
      if (confirm("Are you sure to cancel this?")) {
        console.log(event)
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
