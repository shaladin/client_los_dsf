import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqUpdateProductPostApprovalObj } from 'app/shared/model/request/product/req-add-edit-product-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-prod-ho-apv-detail-x',
  templateUrl: './prod-ho-apv-detail-x.component.html'
})
export class ProdHoApvDetailXComponent implements OnInit {

  ProdHId: number;
  TaskId: number;
  ApvReqId: number;
  IsReady: boolean = false;
  GenericByIdObj : GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  ReqUpdateProdPostApvObj : ReqUpdateProductPostApprovalObj = new ReqUpdateProductPostApprovalObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
        this.TaskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    let ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.TaskId;

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.TaskId;

    this.InputApvObj.TaskId = this.TaskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.GetProductByHId, this.GenericByIdObj).subscribe(
      (response : GenericObj) => {
        this.InputApvObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_APPRV], {});
      }
    )
  }

  onApprovalSubmited(event)
  {
    let reqProdHoApvCustomObj = {
      Id: this.ProdHId,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.ProdHOApproval, reqProdHoApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_APPRV],{ });
      }
    );
  }
  
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_APPRV], {});
  }
}
