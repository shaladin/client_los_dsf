import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-prod-ho-deact-apv-detail',
  templateUrl: './prod-ho-deact-apv-detail.component.html'
})
export class ProdHoDeactApvDetailComponent implements OnInit {

  ProdHId: number;
  TaskId: number;
  ApvReqId: number;
  IsReady: boolean = false;
  GenericByIdObj : GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();

  constructor(private router: Router, 
              private route: ActivatedRoute,
              private http:HttpClient) { 
    this.route.queryParams.subscribe(params => {
    if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
        this.TaskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  ngOnInit() {
    this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformationForDeactApv.json";
  
    let ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.TaskId

    this.HoldTask(ApvHoldObj);
    this. initInputApprovalObj();
  }

  initInputApprovalObj(){
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
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


  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      }
    )
  }

  onApprovalSubmited(event)
  {
    let reqApvCustomObj = {
      AppId: 0,
      Tasks: event.Tasks
    }
    this.http.post(URLConstant.Approval, reqApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV],{ });
      }
    );
  }
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV],{ });
  }
}
