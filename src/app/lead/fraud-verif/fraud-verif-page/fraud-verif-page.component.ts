import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeadCustPersonalObj } from 'app/shared/model/LeadCustPersonalObj.Model';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';
import { LeadAssetObj } from 'app/shared/model/LeadAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { LeadFraudVerfObj } from 'app/shared/model/LeadFraudVerfObj.model';
import { _ } from 'core-js';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { ResDuplicateCustomerObj } from 'app/shared/model/Lead/ResDuplicateCustomerObj.Model';
import { ResDuplicateNegativeCustomerObj } from 'app/shared/model/Lead/ResDuplicateNegativeCustomerObj.Model';
import { ResDuplicateNegativeAssetObj } from 'app/shared/model/Lead/ResDuplicateNegativeAssetObj.Model';
import { ResLeadCustObj } from 'app/shared/model/Lead/ResLeadCustObj.Model';
import { ResDuplicateDoubleFinancingObj } from 'app/shared/model/Lead/ResDuplicateDoubleFinancingObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';

@Component({
  selector: 'app-fraud-verif-page',
  templateUrl: './fraud-verif-page.component.html',
  providers: [NGXToastrService]
})
export class FraudVerifPageComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  dmsObj: DMSObj;
  
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params['WfTaskListId'];
    });
    this.GetLeadCustByLeadIdUrl = URLConstant.GetLeadCustByLeadId;
    this.GetLeadCustPersonalByLeadCustIdUrl = URLConstant.GetLeadCustPersonalByLeadCustId;
    this.GetCustomerAndNegativeCustDuplicateCheckUrl = URLConstant.GetCustomerAndNegativeCustDuplicateCheck;
    this.GetLeadAssetForCheckUrl = URLConstant.GetLeadAssetForCheck;
    this.GetLeadAssetByLeadIdUrl = URLConstant.GetLeadAssetByLeadId;
    this.GetAssetNegativeDuplicateCheckUrl = URLConstant.GetAssetNegativeDuplicateCheck;
    this.AddLeadFraudVerfUrl = URLConstant.AddLeadFraudVerf;
  }
  DuplicateCustObj: DuplicateCustObj = new DuplicateCustObj();
  leadCustObj: LeadCustObj = new LeadCustObj();
  leadAssetObj: LeadAssetObj = new LeadAssetObj();;
  LeadId: string;
  WfTaskListId: number;
  GetLeadCustByLeadIdUrl: string;
  GetLeadCustPersonalByLeadCustIdUrl: string;
  GetCustomerAndNegativeCustDuplicateCheckUrl: string;
  GetLeadAssetForCheckUrl: string;
  tempLeadCustObj: any;//ResLeadCustObj = new ResLeadCustObj();
  tempLeadCustPersonalObj: any;
  leadCustPersonalObj: LeadCustPersonalObj = new LeadCustPersonalObj();;
  DuplicateStatus: string;
  ResultDuplicate: ResDuplicateCustomerObj = new ResDuplicateCustomerObj();
  ResultDuplicateNegative: ResDuplicateNegativeCustomerObj = new ResDuplicateNegativeCustomerObj();
  negativeAssetCheckObj: NegativeAssetCheckObj = new NegativeAssetCheckObj();;
  tempAssetCategoryTypeCode: any;
  GetLeadAssetByLeadIdUrl: string;
  tempLeadAsset: any;
  GetAssetNegativeDuplicateCheckUrl: string;
  ResultDuplicateAssetNegative: ResDuplicateNegativeAssetObj = new ResDuplicateNegativeAssetObj();
  ResultDuplicateDoubleFinancing: ResDuplicateDoubleFinancingObj = new ResDuplicateDoubleFinancingObj();
  leadFraudVerfObj: LeadFraudVerfObj = new LeadFraudVerfObj();
  AddLeadFraudVerfUrl: string;
  FraudVerfForm = this.fb.group({
    Notes: ['', [Validators.required]],
  });
  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
    this.leadCustObj.LeadId = this.LeadId;
    this.http.post(this.GetLeadCustByLeadIdUrl, this.leadCustObj).subscribe(
      (response) => {
        this.tempLeadCustObj = response;
        this.leadCustPersonalObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        this.http.post(this.GetLeadCustPersonalByLeadCustIdUrl, this.leadCustPersonalObj).subscribe(
          (response) => {
            this.tempLeadCustPersonalObj = response;
            this.DuplicateCustObj.CustName = this.tempLeadCustObj.CustName;
            this.DuplicateCustObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
            this.DuplicateCustObj.IdNo = this.tempLeadCustObj.IdNo;
            this.DuplicateCustObj.TaxIdNo = this.tempLeadCustObj.TaxIdNo;
            this.DuplicateCustObj.BirthDt = this.tempLeadCustPersonalObj.BirthDt;
            this.DuplicateCustObj.MotherMaidenName = this.tempLeadCustPersonalObj.MotherMaidenName;
            this.http.post(this.GetCustomerAndNegativeCustDuplicateCheckUrl, this.DuplicateCustObj).subscribe(
              (response) => {
                this.DuplicateStatus = response["Status"];
                if (this.DuplicateStatus != null && this.DuplicateStatus != undefined) {
                  this.ResultDuplicate = response[CommonConstant.ReturnObj]["CustDuplicate"];
                  this.ResultDuplicateNegative = response[CommonConstant.ReturnObj]["NegativeCustDuplicate"];
                }
              });
          });
      });

    this.http.post(URLConstant.GetLeadByLeadId, { LeadId: this.LeadId }).subscribe(
      (response) => {
        let currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
            this.dmsObj.ViewCode = CommonConstant.DmsViewCodeLead;
            this.dmsObj.MetadataParent = null;
            this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsLeadId, response["LeadNo"]));
            this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
        
        if(response["LobCode"] !== CommonConstant.CFNA){
          this.leadAssetObj.LeadId = this.LeadId;
          this.http.post(this.GetLeadAssetByLeadIdUrl, this.leadAssetObj).subscribe(
            (response) => {
              this.tempLeadAsset = response;
              this.leadAssetObj.FullAssetCode = this.tempLeadAsset.FullAssetCode;
              this.http.post(this.GetLeadAssetForCheckUrl, this.leadAssetObj).subscribe(
                (response) => {
                  this.tempAssetCategoryTypeCode = response;
                  this.negativeAssetCheckObj.AssetTypeCode = this.tempAssetCategoryTypeCode.AssetTypeCode;
                  this.negativeAssetCheckObj.SerialNo1 = this.tempLeadAsset.SerialNo1;
                  this.negativeAssetCheckObj.SerialNo2 = this.tempLeadAsset.SerialNo2;
                  this.negativeAssetCheckObj.SerialNo3 = this.tempLeadAsset.SerialNo3;
                  this.negativeAssetCheckObj.SerialNo4 = this.tempLeadAsset.SerialNo4;
                  this.negativeAssetCheckObj.SerialNo5 = this.tempLeadAsset.SerialNo5;
      
                  this.http.post(URLConstant.GetDoubleFinancingCheckAppAsset, this.negativeAssetCheckObj).subscribe(
                    (response) => {
                      this.ResultDuplicateDoubleFinancing = response[CommonConstant.ReturnObj];
                    })
      
                  this.http.post(this.GetAssetNegativeDuplicateCheckUrl, this.negativeAssetCheckObj).subscribe(
                    (response) => {
                      this.ResultDuplicateAssetNegative = response[CommonConstant.ReturnObj];
                    });
                });
            });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  reject(): void {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = CommonConstant.Reject;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.leadFraudVerfObj.WfTaskListId = this.WfTaskListId;
    this.http.post(this.AddLeadFraudVerfUrl, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Lead/FraudVerif/Paging"],{});
      });
  }

  verify(): void {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = CommonConstant.Verify;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.leadFraudVerfObj.WfTaskListId = this.WfTaskListId;

    this.http.post(this.AddLeadFraudVerfUrl, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Lead/FraudVerif/Paging"],{});
      });
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
  backHandler() {
    AdInsHelper.RedirectUrl(this.router,["/Lead/FraudVerif/Paging"],{});
  }
}
