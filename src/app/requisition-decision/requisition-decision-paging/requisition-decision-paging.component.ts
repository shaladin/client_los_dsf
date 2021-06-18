import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WorkflowReqObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-requisition-decision-paging',
  templateUrl: './requisition-decision-paging.component.html'
})
export class RequisitionDecisionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  isReady: boolean = false;
  wfReqObj: WorkflowReqObj = new WorkflowReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(private router: Router,
    private toastr: NGXToastrService,
    private http: HttpClient,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  async ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/requisition-decision/search-requisition-decision-paging.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/requisition-decision/search-requisition-decision-paging.json";
    this.inputPagingObj.isJoinExAPI = true;

    this.wfReqObj.ActCode = CommonConstant.ACT_CODE_REQU_DEC + this.BizTemplateCode;
    this.integrationObj.baseUrl = environment.WfR3Url;
    this.integrationObj.apiPath = URLConstant.GetListOSWfTaskListByActCode;
    this.integrationObj.requestObj = this.wfReqObj;
    this.integrationObj.leftColumnToJoin = "AppNo";
    this.integrationObj.rightColumnToJoin = "TransactionCode";
    this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
    this.inputPagingObj.integrationObj = this.integrationObj;

    this.isReady = true;
  }

  getCallBack(event: any) {
    if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
    }
    if (event.Key === "Edit") {
      this.http.post(URLConstant.IsSecurityDepositExist, { Id: event.RowObj.AppId }).subscribe(
        (response) => {
          if (response[CommonConstant.Result] == "True") {
            this.http.post(URLConstant.CheckGoLivePayment, { AgrmntNo: event.RowObj.AgrmntNo }).subscribe(
              (response) => {
                if (response["IsPaid"]) {
                  AdInsHelper.RedirectUrl(this.router, [NavigationConstant.REQUISITION_DECISION_DETAIL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
                }
                else {
                  this.toastr.errorMessage("Security Deposit has not been paid yet!");
                }
              },
              (error) => {
                this.toastr.warningMessage("Agreement not found!");
              }
            );
          }
          else {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.REQUISITION_DECISION_DETAIL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
          }
        }
      );
    }
  }

  // GetAllAssetFinancialData(AppId: number) {
  //   this.http.post(URLConstant.GetListAppAssetFinDataGridByAppId, { Id: AppId }).subscribe(
  //     (response) => {
  //       if (response["AppAssetFinDataGridObjs"].length > 0) { }
  //     }
  //   );
  // }
}