import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqUpdateProductPostApvObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { ResProductObj } from 'app/shared/model/Response/Product/ResProductObj.Model';
@Component({
  selector: 'app-prod-ho-apv-detail',
  templateUrl: './prod-ho-apv-detail.component.html'
})
export class ProdHoApvDetailComponent implements OnInit {

  prodHId: number;
  taskId: number;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  ReqUpdateProductPostApvObj: ReqUpdateProductPostApvObj

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.prodHId = params["ProdHId"];
        this.taskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  ngOnInit() {
    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId;

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.http.post(URLConstant.GetProductByHId, { Id: this.prodHId }).subscribe(
      (response: ResProductObj) => {
        this.InputApvObj.TrxNo = response.ProdCode;
        this.IsReady = true;
      });
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      }
    )
  }

  onApprovalSubmited(event) {
    this.ReqUpdateProductPostApvObj = new ReqUpdateProductPostApvObj();
    this.ReqUpdateProductPostApvObj.ProdHId = this.prodHId;
    this.ReqUpdateProductPostApvObj.TaskId = event[0].ApvTaskId;
    this.ReqUpdateProductPostApvObj.Notes = event[0].Notes != undefined ? event[0].Notes : "";
    this.ReqUpdateProductPostApvObj.Reason = event[0].ReasonCode;
    this.ReqUpdateProductPostApvObj.Result = event[0].ApvResult
    this.http.post(URLConstant.UpdateProductPostApv, this.ReqUpdateProductPostApvObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_APPRV], {});
      }
    );
  }
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_APPRV], {});
  }
}
