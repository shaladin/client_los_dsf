import { Component, OnInit } from '@angular/core';
import { LeadCustObj } from 'app/shared/model/Request/LEAD/LeadCustObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeadCustPersonalObj } from 'app/shared/model/Request/LEAD/LeadCustPersonalObj.model';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';
import { LeadAssetObj } from 'app/shared/model/Request/LEAD/LeadAssetObj.model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { LeadFraudVerfObj } from 'app/shared/model/Request/LEAD/LeadFraudVerfObj.model';
import { _ } from 'core-js';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ResDuplicateCustomerObj } from 'app/shared/model/Lead/ResDuplicateCustomerObj.Model';
import { ResDuplicateNegativeCustomerObj } from 'app/shared/model/Lead/ResDuplicateNegativeCustomerObj.Model';
import { ResDuplicateNegativeAssetObj } from 'app/shared/model/Lead/ResDuplicateNegativeAssetObj.Model';
import { ResDuplicateDoubleFinancingObj } from 'app/shared/model/Lead/ResDuplicateDoubleFinancingObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ThirdPartyRsltHObj } from 'app/shared/model/ThirdPartyRsltHObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-fraud-verif-page',
  templateUrl: './fraud-verif-page.component.html',
  providers: [NGXToastrService]
})
export class FraudVerifPageComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  ResultThirdPartyObj: any;
  thirdPartyRsltHObj: ThirdPartyRsltHObj;
  dmsObj: DMSObj;
  isDmsReady: boolean = false;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params['WfTaskListId'];
    });
  }
  DuplicateCustObj: DuplicateCustObj = new DuplicateCustObj();
  leadCustObj: LeadCustObj = new LeadCustObj();
  leadAssetObj: LeadAssetObj = new LeadAssetObj();;
  LeadId: number;
  WfTaskListId: number;
  tempLeadCustObj: any;//ResLeadCustObj = new ResLeadCustObj();
  tempLeadCustPersonalObj: any;
  leadCustPersonalObj: LeadCustPersonalObj = new LeadCustPersonalObj();;
  DuplicateStatus: string;
  ResultDuplicate: ResDuplicateCustomerObj[] = new Array<ResDuplicateCustomerObj>();
  ResultDuplicateNegative: ResDuplicateNegativeCustomerObj[] = new Array<ResDuplicateNegativeCustomerObj>();
  negativeAssetCheckObj: NegativeAssetCheckObj = new NegativeAssetCheckObj();;
  tempAssetCategoryTypeCode: any;
  tempLeadAsset: any;
  ResultDuplicateAssetNegative: ResDuplicateNegativeAssetObj[] = new Array<ResDuplicateNegativeAssetObj>();
  ResultDuplicateDoubleFinancing: ResDuplicateDoubleFinancingObj[] = new Array<ResDuplicateDoubleFinancingObj>();
  leadFraudVerfObj: LeadFraudVerfObj = new LeadFraudVerfObj();
  FraudVerfForm = this.fb.group({
    Notes: ['', [Validators.required]],
  });
  async ngOnInit() : Promise<void> {
    if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);

    }
    this.thirdPartyRsltHObj = new ThirdPartyRsltHObj();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
      });
    this.leadCustObj.LeadId = this.LeadId;
    var obj = { Id: this.LeadId };
    this.http.post(URLConstant.GetLeadCustByLeadId, obj).subscribe(
      (response) => {
        this.tempLeadCustObj = response;
        this.leadCustPersonalObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        var obj1 = { Id: this.tempLeadCustObj.LeadCustId };
        this.http.post(URLConstant.GetLeadCustByLeadId, obj1).subscribe(
          (response) => {
            this.tempLeadCustPersonalObj = response;
            this.DuplicateCustObj = new DuplicateCustObj();
            this.DuplicateCustObj.CustName = this.tempLeadCustObj.CustName;
            this.DuplicateCustObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
            this.DuplicateCustObj.IdNo = this.tempLeadCustObj.IdNo;
            this.DuplicateCustObj.TaxIdNo = this.tempLeadCustObj.TaxIdNo;
            this.DuplicateCustObj.BirthDt = this.tempLeadCustPersonalObj.BirthDt;
            this.DuplicateCustObj.MotherMaidenName = this.tempLeadCustPersonalObj.MotherMaidenName;
            this.http.post(URLConstant.GetCustomerAndNegativeCustDuplicateCheck, this.DuplicateCustObj).subscribe(
              (response) => {
                this.DuplicateStatus = response["Status"];
                if (this.DuplicateStatus != null && this.DuplicateStatus != undefined) {
                  this.ResultDuplicate = response[CommonConstant.ReturnObj]["CustDuplicate"];
                  this.ResultDuplicateNegative = response[CommonConstant.ReturnObj]["NegativeCustDuplicate"];
                  console.log(response[CommonConstant.ReturnObj]["NegativeCustDuplicate"])
                }
              });
          });
      });
    this.http.post(URLConstant.GetLeadByLeadId, { Id: this.LeadId }).subscribe(
      (response) => {
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        if(this.SysConfigResultObj.ConfigValue == '1'){
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeLead;
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response["LeadNo"]));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsLeadId, response["LeadNo"]));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          this.isDmsReady = true;
        }
        if (response["LobCode"] !== CommonConstant.CFNA) {
          this.leadAssetObj.LeadId = this.LeadId;
          var leadAssetObj = { Id: this.LeadId };
          this.http.post(URLConstant.GetLeadAssetByLeadId, leadAssetObj).subscribe(
            (response) => {
              this.tempLeadAsset = response;
              this.leadAssetObj.FullAssetCode = this.tempLeadAsset.FullAssetCode;
              this.http.post(URLConstant.GetLeadAssetForCheck, leadAssetObj).subscribe(
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

                  this.http.post(URLConstant.GetAssetNegativeDuplicateCheck, this.negativeAssetCheckObj).subscribe(
                    (response) => {
                      this.ResultDuplicateAssetNegative = response[CommonConstant.ReturnObj];
                    });
                });
            });
        }
        this.thirdPartyRsltHObj.TrxNo = response['LeadNo'];
        this.http.post(URLConstant.GetFraudResult, this.thirdPartyRsltHObj).subscribe(
          (response) => {
            this.ResultThirdPartyObj = response;
          });
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
    this.http.post(URLConstant.AddLeadFraudVerf, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.LEAD_FRAUD_VERIF_PAGING],{});
      });
  }

  verify(): void {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = CommonConstant.Verify;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.leadFraudVerfObj.WfTaskListId = this.WfTaskListId;
    this.http.post(URLConstant.AddLeadFraudVerf, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.LEAD_FRAUD_VERIF_PAGING],{});
      });
  }

  backHandler() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.LEAD_FRAUD_VERIF_PAGING],{});
  }
}
