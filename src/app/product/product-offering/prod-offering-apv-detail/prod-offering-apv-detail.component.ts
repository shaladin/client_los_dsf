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
import { ReqUpdateProdOfferingPostApprovalObj } from 'app/shared/model/Request/Product/ReqAddEditProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
@Component({
  selector: 'app-prod-offering-apv-detail',
  templateUrl: './prod-offering-apv-detail.component.html'
})
export class ProdOfferingApvDetailComponent implements OnInit {

  prodOfferingHId: number;
  taskId: number;
  ApvReqId: number;
  inputObj: any;
  IsReady: boolean = false;
  GenericByIdObj: GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj= new UcInputApprovalGeneralInfoObj();
  ReqUpdateProdOffPostApvObj : ReqUpdateProdOfferingPostApprovalObj = new ReqUpdateProdOfferingPostApprovalObj();

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdOfferingHId"] != null) {
        this.prodOfferingHId = params["ProdOfferingHId"];
        this.taskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
   }

  ngOnInit() {
    var obj = {
      taskId: this.taskId,
      approvalBaseUrl: environment.ApprovalR3Url
    }

    this.inputObj = obj;

    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = obj.taskId

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  initInputApprovalObj(){
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.GenericByIdObj.Id = this.prodOfferingHId;
    this.http.post(URLConstant.GetProdOfferingHById, this.GenericByIdObj).subscribe(
      (response) => {
        this.InputApvObj.TrxNo = response["ProdOfferingCode"];
        this.IsReady = true;
      });
  }

  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      }
    )
  }
 
  onApprovalSubmited(event)
  {
    this.ReqUpdateProdOffPostApvObj.ProdOfferingHId = this.prodOfferingHId;
    this.ReqUpdateProdOffPostApvObj.TaskId = event[0].TaskId;
    this.ReqUpdateProdOffPostApvObj.Notes = event[0].Notes;
    this.ReqUpdateProdOffPostApvObj.Reason = event[0].Reason;
    this.ReqUpdateProdOffPostApvObj.Result = event[0].ApvResult;

    this.http.post(URLConstant.UpdateProdOfferingPostApv, this.ReqUpdateProdOffPostApvObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_OFFERING_APPRV],{ });
      }
    );
  }

  onCancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_OFFERING_APPRV],{ });
  }
}
