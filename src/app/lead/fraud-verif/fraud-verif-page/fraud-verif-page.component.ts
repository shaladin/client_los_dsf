import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeadCustPersonalObj } from 'app/shared/model/LeadCustPersonalObj.Model';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';
import { LeadAssetObj } from 'app/shared/model/LeadAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { LeadFraudVerfObj } from 'app/shared/model/LeadFraudVerfObj.model';
import { _ } from 'core-js';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fraud-verif-page',
  templateUrl: './fraud-verif-page.component.html',
  providers: [NGXToastrService]
})
export class FraudVerifPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params['WfTaskListId'];
    });
    this.GetLeadCustByLeadIdUrl = AdInsConstant.GetLeadCustByLeadId;
    this.GetLeadCustPersonalByLeadCustIdUrl = AdInsConstant.GetLeadCustPersonalByLeadCustId;
    this.GetCustomerAndNegativeCustDuplicateCheckUrl = AdInsConstant.GetCustomerAndNegativeCustDuplicateCheck;
    this.GetLeadAssetForCheckUrl = AdInsConstant.GetLeadAssetForCheck;
    this.GetLeadAssetByLeadIdUrl = AdInsConstant.GetLeadAssetByLeadId;
    this.GetAssetNegativeDuplicateCheckUrl = AdInsConstant.GetAssetNegativeDuplicateCheck;
    this.AddLeadFraudVerfUrl = AdInsConstant.AddLeadFraudVerf;
  }
  viewFraudVerification: any;
  DuplicateCustObj: any;
  leadCustObj: any;
  leadAssetObj: any;
  LeadId: any;
  WfTaskListId: any;
  GetLeadCustByLeadIdUrl: string;
  GetLeadCustPersonalByLeadCustIdUrl: any;
  GetCustomerAndNegativeCustDuplicateCheckUrl: string;
  GetLeadAssetForCheckUrl: string;
  tempLeadCustObj: any;
  tempLeadCustPersonalObj: any;
  leadCustPersonalObj: any;
  DuplicateStatus: string;
  ResultDuplicate: any;
  ResultDuplicateNegative: any;
  negativeAssetCheckObj: any;
  tempAssetCategoryTypeCode: any;
  GetLeadAssetByLeadIdUrl: string;
  tempLeadAsset: any;
  GetAssetNegativeDuplicateCheckUrl: string;
  ResultDuplicateAssetNegative: any;
  leadFraudVerfObj: any;
  AddLeadFraudVerfUrl: string;
  FraudVerfForm = this.fb.group({
    Notes: ['', [Validators.required]],
  });
  ngOnInit() {
    this.claimTask();
    this.viewFraudVerification = "./assets/ucviewgeneric/viewFraudVerification.json";

    this.leadCustObj = new LeadCustObj();
    this.leadCustObj.LeadId = this.LeadId;
    this.leadCustPersonalObj = new LeadCustPersonalObj();

    this.http.post(this.GetLeadCustByLeadIdUrl, this.leadCustObj).subscribe(
      (response) => {
        this.tempLeadCustObj = response;
        this.leadCustPersonalObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        this.http.post(this.GetLeadCustPersonalByLeadCustIdUrl, this.leadCustPersonalObj).subscribe(
          (response) => {
            this.tempLeadCustPersonalObj = response;
            this.DuplicateCustObj = new DuplicateCustObj();
            this.DuplicateCustObj.CustName = this.tempLeadCustObj.CustName;
            this.DuplicateCustObj.MrCustTypeCode = "PERSONAL";
            this.DuplicateCustObj.IdNo = this.tempLeadCustObj.IdNo;
            this.DuplicateCustObj.TaxIdNo = this.tempLeadCustObj.TaxIdNo;
            this.DuplicateCustObj.BirthDt = this.tempLeadCustPersonalObj.BirthDt;
            this.DuplicateCustObj.MotherMaidenName = this.tempLeadCustPersonalObj.MotherMaidenName;
            this.http.post(this.GetCustomerAndNegativeCustDuplicateCheckUrl, this.DuplicateCustObj).subscribe(
              (response) => {
                this.DuplicateStatus = response["Status"];
                if (this.DuplicateStatus != null && this.DuplicateStatus != undefined) {
                  this.ResultDuplicate = response["ReturnObject"]["CustDuplicate"];
                  this.ResultDuplicateNegative = response["ReturnObject"]["NegativeCustDuplicate"];
                }
              });
          });
      });
    this.leadAssetObj = new LeadAssetObj();
    this.leadAssetObj.LeadId = this.LeadId;
    this.http.post(this.GetLeadAssetByLeadIdUrl, this.leadAssetObj).subscribe(
      (response) => {
        console.log(response);
        this.tempLeadAsset = response;
        this.leadAssetObj.FullAssetCode = this.tempLeadAsset.FullAssetCode;
        this.http.post(this.GetLeadAssetForCheckUrl, this.leadAssetObj).subscribe(
          (response) => {
            this.tempAssetCategoryTypeCode = response;
            this.negativeAssetCheckObj = new NegativeAssetCheckObj();
            this.negativeAssetCheckObj.AssetTypeCode = this.tempAssetCategoryTypeCode.AssetTypeCode;
            this.negativeAssetCheckObj.SerialNo1 = this.tempLeadAsset.SerialNo1;
            this.negativeAssetCheckObj.SerialNo2 = this.tempLeadAsset.SerialNo2;
            this.negativeAssetCheckObj.SerialNo3 = this.tempLeadAsset.SerialNo3;
            this.negativeAssetCheckObj.SerialNo4 = this.tempLeadAsset.SerialNo4;
            this.negativeAssetCheckObj.SerialNo5 = this.tempLeadAsset.SerialNo5;
            this.http.post(this.GetAssetNegativeDuplicateCheckUrl, this.negativeAssetCheckObj).subscribe(
              (response) => {
                this.ResultDuplicateAssetNegative = response["ReturnObject"];
                console.log(response);
              });
          });
      });


  }

  reject() {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = AdInsConstant.Reject;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.http.post(this.AddLeadFraudVerfUrl, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      });
  }

  claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"] };
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
  verify() {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = AdInsConstant.Verify;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;

    this.http.post(this.AddLeadFraudVerfUrl, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      });
  }

}
